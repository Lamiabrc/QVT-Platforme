-- Famille MVP schema + RLS

create extension if not exists "pgcrypto";

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.family_members (
  family_id uuid references public.families (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  role text not null check (role in ('parent', 'tutor', 'teen', 'child')),
  created_at timestamptz default now(),
  primary key (family_id, user_id)
);

create table if not exists public.family_invitations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families (id) on delete cascade,
  code text not null unique,
  role text not null check (role in ('parent', 'tutor', 'teen', 'child')),
  expires_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  used_at timestamptz,
  used_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  category text,
  severity text check (severity in ('low', 'medium', 'high')),
  message text,
  status text not null default 'open' check (status in ('open', 'triaged', 'resolved')),
  created_at timestamptz default now(),
  -- legacy columns kept nullable if already present
  risk_level text,
  primary_axis text,
  user_id uuid,
  target_role text,
  user_consent boolean,
  resolved_at timestamptz,
  notes text,
  anonymized_message boolean
);

create or replace function public.is_family_member(family_uuid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.family_members fm
    where fm.family_id = family_uuid and fm.user_id = auth.uid()
  );
$$;

create or replace function public.is_family_guardian(family_uuid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.family_members fm
    where fm.family_id = family_uuid
      and fm.user_id = auth.uid()
      and fm.role in ('parent', 'tutor')
  );
$$;

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_invitations enable row level security;
alter table public.alerts enable row level security;

create policy "families_select_members"
  on public.families for select
  using (public.is_family_member(id));

create policy "families_insert_owner"
  on public.families for insert
  with check (auth.uid() = created_by);

create policy "families_update_guardian"
  on public.families for update
  using (public.is_family_guardian(id));

create policy "family_members_select"
  on public.family_members for select
  using (public.is_family_member(family_id));

create policy "family_members_insert_self"
  on public.family_members for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.family_invitations fi
      where fi.family_id = family_id
        and fi.used_at is null
        and (fi.expires_at is null or fi.expires_at > now())
    )
  );

create policy "family_members_insert_guardian"
  on public.family_members for insert
  with check (public.is_family_guardian(family_id));

create policy "family_invitations_select_guardian"
  on public.family_invitations for select
  using (public.is_family_guardian(family_id));

create policy "family_invitations_insert_guardian"
  on public.family_invitations for insert
  with check (public.is_family_guardian(family_id));

create policy "alerts_select_guardian_or_creator"
  on public.alerts for select
  using (
    (family_id is not null and public.is_family_guardian(family_id))
    or created_by = auth.uid()
  );

create policy "alerts_insert_member"
  on public.alerts for insert
  with check (family_id is not null and public.is_family_member(family_id));
