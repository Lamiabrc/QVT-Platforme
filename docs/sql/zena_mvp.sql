-- ZENA MVP schema + RLS

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role_global text default 'guardian' check (role_global in ('guardian', 'teen', 'child', 'admin', 'employee')),
  created_at timestamptz default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  plan_status text not null default 'trial' check (plan_status in ('trial', 'active', 'paused')),
  created_at timestamptz default now()
);

create table if not exists public.family_members (
  family_id uuid references public.families (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  role text not null check (role in ('guardian', 'teen', 'child')),
  created_at timestamptz default now(),
  primary key (family_id, user_id)
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  name text not null,
  status text not null default 'lead' check (status in ('lead', 'active')),
  created_at timestamptz default now()
);

create table if not exists public.company_members (
  company_id uuid references public.companies (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'employee')),
  created_at timestamptz default now(),
  primary key (company_id, user_id)
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  tenant_type text not null check (tenant_type in ('family', 'company')),
  tenant_id uuid not null,
  role text not null,
  code text not null unique,
  expires_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_type text not null check (tenant_type in ('family', 'company')),
  tenant_id uuid not null,
  created_by uuid references auth.users (id) on delete set null,
  category text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  message text not null,
  status text not null default 'open' check (status in ('open', 'triaged', 'resolved')),
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  tenant_type text not null check (tenant_type in ('family', 'company')),
  tenant_id uuid not null,
  author_id uuid references auth.users (id) on delete set null,
  visibility text not null default 'tenant' check (visibility in ('tenant', 'group')),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  tenant_type text not null check (tenant_type in ('family', 'company')),
  tenant_id uuid not null,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.group_members (
  group_id uuid references public.groups (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  created_at timestamptz default now(),
  primary key (group_id, user_id)
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  tenant_type text not null check (tenant_type in ('family', 'company')),
  tenant_id uuid not null,
  owner_id uuid references auth.users (id) on delete set null,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

create index if not exists alerts_tenant_idx on public.alerts (tenant_type, tenant_id);
create index if not exists posts_tenant_idx on public.posts (tenant_type, tenant_id);
create index if not exists plans_tenant_idx on public.plans (tenant_type, tenant_id);
create index if not exists invites_tenant_idx on public.invites (tenant_type, tenant_id);

create or replace function public.is_family_member(family_uuid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.family_members fm
    where fm.family_id = family_uuid and fm.user_id = auth.uid()
  );
$$;

create or replace function public.is_company_member(company_uuid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.company_members cm
    where cm.company_id = company_uuid and cm.user_id = auth.uid()
  );
$$;

create or replace function public.is_family_guardian(family_uuid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.family_members fm
    where fm.family_id = family_uuid and fm.user_id = auth.uid() and fm.role = 'guardian'
  );
$$;

create or replace function public.is_company_admin(company_uuid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.company_members cm
    where cm.company_id = company_uuid and cm.user_id = auth.uid() and cm.role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.invites enable row level security;
alter table public.alerts enable row level security;
alter table public.posts enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.plans enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "families_select_members"
  on public.families for select
  using (public.is_family_member(id));

create policy "families_insert_owner"
  on public.families for insert
  with check (auth.uid() = owner_id);

create policy "families_update_guardian"
  on public.families for update
  using (public.is_family_guardian(id) or auth.uid() = owner_id);

create policy "family_members_select"
  on public.family_members for select
  using (public.is_family_member(family_id));

create policy "family_members_insert_guardian"
  on public.family_members for insert
  with check (public.is_family_guardian(family_id) or auth.uid() = (select owner_id from public.families where id = family_id));

create policy "companies_select_members"
  on public.companies for select
  using (public.is_company_member(id));

create policy "companies_insert_owner"
  on public.companies for insert
  with check (auth.uid() = owner_id);

create policy "companies_update_admin"
  on public.companies for update
  using (public.is_company_admin(id) or auth.uid() = owner_id);

create policy "company_members_select"
  on public.company_members for select
  using (public.is_company_member(company_id));

create policy "company_members_insert_admin"
  on public.company_members for insert
  with check (public.is_company_admin(company_id) or auth.uid() = (select owner_id from public.companies where id = company_id));

create policy "invites_select_members"
  on public.invites for select
  using (
    (tenant_type = 'family' and public.is_family_guardian(tenant_id))
    or (tenant_type = 'company' and public.is_company_admin(tenant_id))
  );

create policy "invites_insert_admins"
  on public.invites for insert
  with check (
    (tenant_type = 'family' and public.is_family_guardian(tenant_id))
    or (tenant_type = 'company' and public.is_company_admin(tenant_id))
  );

create policy "alerts_select_guardians_or_creator"
  on public.alerts for select
  using (
    created_by = auth.uid()
    or (tenant_type = 'family' and public.is_family_guardian(tenant_id))
    or (tenant_type = 'company' and public.is_company_admin(tenant_id))
  );

create policy "alerts_insert_members"
  on public.alerts for insert
  with check (
    (tenant_type = 'family' and public.is_family_member(tenant_id))
    or (tenant_type = 'company' and public.is_company_member(tenant_id))
  );

create policy "posts_select_members"
  on public.posts for select
  using (
    (tenant_type = 'family' and public.is_family_member(tenant_id))
    or (tenant_type = 'company' and public.is_company_member(tenant_id))
  );

create policy "posts_insert_members"
  on public.posts for insert
  with check (
    (tenant_type = 'family' and public.is_family_member(tenant_id))
    or (tenant_type = 'company' and public.is_company_member(tenant_id))
  );

create policy "groups_select_members"
  on public.groups for select
  using (
    (tenant_type = 'family' and public.is_family_member(tenant_id))
    or (tenant_type = 'company' and public.is_company_member(tenant_id))
  );

create policy "groups_insert_members"
  on public.groups for insert
  with check (
    (tenant_type = 'family' and public.is_family_guardian(tenant_id))
    or (tenant_type = 'company' and public.is_company_admin(tenant_id))
  );

create policy "group_members_select"
  on public.group_members for select
  using (
    exists (
      select 1 from public.groups g
      where g.id = group_id and (
        (g.tenant_type = 'family' and public.is_family_member(g.tenant_id))
        or (g.tenant_type = 'company' and public.is_company_member(g.tenant_id))
      )
    )
  );

create policy "group_members_insert"
  on public.group_members for insert
  with check (
    exists (
      select 1 from public.groups g
      where g.id = group_id and (
        (g.tenant_type = 'family' and public.is_family_guardian(g.tenant_id))
        or (g.tenant_type = 'company' and public.is_company_admin(g.tenant_id))
      )
    )
  );

create policy "plans_select_members"
  on public.plans for select
  using (
    (tenant_type = 'family' and public.is_family_member(tenant_id))
    or (tenant_type = 'company' and public.is_company_member(tenant_id))
  );

create policy "plans_insert_members"
  on public.plans for insert
  with check (
    (tenant_type = 'family' and public.is_family_member(tenant_id))
    or (tenant_type = 'company' and public.is_company_member(tenant_id))
  );
