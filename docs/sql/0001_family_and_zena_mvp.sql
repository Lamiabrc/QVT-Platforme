-- 0001 Family + ZENA MVP schema + RLS

create extension if not exists "pgcrypto";

-- Families
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

-- ZENA conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  sphere text not null check (sphere in ('family', 'company')),
  family_id uuid references public.families (id) on delete set null,
  company_id uuid references public.enterprises (id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations (id) on delete cascade,
  author text not null check (author in ('user', 'zena')),
  content text not null,
  risk_score numeric,
  risk_labels text[],
  created_at timestamptz default now()
);

create table if not exists public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  sphere text not null check (sphere in ('family', 'company')),
  family_id uuid references public.families (id) on delete set null,
  company_id uuid references public.enterprises (id) on delete set null,
  score numeric not null,
  labels text[],
  created_at timestamptz default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families (id) on delete set null,
  company_id uuid references public.enterprises (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null,
  category text,
  severity text not null check (severity in ('low', 'medium', 'high')),
  message text not null,
  status text not null default 'open' check (status in ('open', 'triaged', 'resolved')),
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- Helpers
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

create or replace function public.is_company_member(company_uuid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.enterprise_members em
    where em.enterprise_id = company_uuid and em.user_id = auth.uid()
  );
$$;

-- RLS
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_invitations enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.risk_assessments enable row level security;
alter table public.alerts enable row level security;

create policy "families_select_members"
  on public.families for select
  using (public.is_family_member(id) or created_by = auth.uid());

create policy "families_insert_owner"
  on public.families for insert
  with check (auth.uid() = created_by);

create policy "families_update_guardian"
  on public.families for update
  using (public.is_family_guardian(id));

create policy "family_members_select"
  on public.family_members for select
  using (public.is_family_member(family_id));

create policy "family_members_insert_owner"
  on public.family_members for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.families f
      where f.id = family_id and f.created_by = auth.uid()
    )
  );

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

create policy "family_invitations_update_consumer"
  on public.family_invitations for update
  using (used_at is null and (expires_at is null or expires_at > now()))
  with check (used_by = auth.uid());

create policy "conversations_select_owner"
  on public.conversations for select
  using (
    user_id = auth.uid()
    or (family_id is not null and public.is_family_member(family_id))
    or (company_id is not null and public.is_company_member(company_id))
  );

create policy "conversations_insert_owner"
  on public.conversations for insert
  with check (user_id = auth.uid());

create policy "messages_select_owner"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (
          c.user_id = auth.uid()
          or (c.family_id is not null and public.is_family_member(c.family_id))
          or (c.company_id is not null and public.is_company_member(c.company_id))
        )
    )
  );

create policy "messages_insert_owner"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

create policy "risk_assessments_select"
  on public.risk_assessments for select
  using (
    created_by = auth.uid()
    or (family_id is not null and public.is_family_member(family_id))
    or (company_id is not null and public.is_company_member(company_id))
  );

create policy "risk_assessments_insert"
  on public.risk_assessments for insert
  with check (created_by = auth.uid());

create policy "alerts_select_members"
  on public.alerts for select
  using (
    created_by = auth.uid()
    or (family_id is not null and public.is_family_member(family_id))
    or (company_id is not null and public.is_company_member(company_id))
  );

create policy "alerts_insert_members"
  on public.alerts for insert
  with check (
    created_by = auth.uid()
    or (family_id is not null and public.is_family_member(family_id))
    or (company_id is not null and public.is_company_member(company_id))
  );
