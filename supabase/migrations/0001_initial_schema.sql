create extension if not exists "pgcrypto";

create type public.app_role as enum ('requester', 'technician', 'manager', 'admin');
create type public.request_priority as enum ('Low', 'Medium', 'High', 'Urgent');
create type public.work_order_status as enum (
  'New',
  'Claimed',
  'In Progress',
  'Waiting',
  'Scheduled',
  'Completed',
  'Manager Review',
  'Closed',
  'Reopened'
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  requester_user_id uuid not null references auth.users(id) on delete restrict,
  site_id uuid not null references public.sites(id) on delete restrict,
  title text not null,
  description text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  priority public.request_priority not null default 'Medium',
  building text,
  floor text,
  room text,
  hallway text,
  location_notes text,
  created_at timestamptz not null default now()
);

create table public.work_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  request_id uuid not null unique references public.requests(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete restrict,
  assigned_user_id uuid references auth.users(id) on delete set null,
  claimed_by_user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  priority public.request_priority not null default 'Medium',
  status public.work_order_status not null default 'New',
  due_at timestamptz,
  scheduled_for timestamptz,
  completed_at timestamptz,
  closed_at timestamptz,
  building text,
  floor text,
  room text,
  hallway text,
  location_notes text,
  labor_cost_total numeric(12,2) not null default 0,
  material_cost_total numeric(12,2) not null default 0,
  total_cost numeric(12,2) not null default 0,
  completion_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_order_status_history (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  from_status public.work_order_status,
  to_status public.work_order_status not null,
  changed_by_user_id uuid not null references auth.users(id) on delete restrict,
  changed_at timestamptz not null default now()
);

create table public.work_order_comments (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.labor_entries (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  hours numeric(8,2) not null check (hours >= 0),
  hourly_rate numeric(12,2),
  total_cost numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table public.material_entries (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  name text not null,
  quantity numeric(10,2) not null check (quantity >= 0),
  unit_cost numeric(12,2) not null default 0,
  total_cost numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  work_order_id uuid references public.work_orders(id) on delete cascade,
  request_id uuid references public.requests(id) on delete cascade,
  uploaded_by_user_id uuid not null references auth.users(id) on delete restrict,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  created_at timestamptz not null default now(),
  check (work_order_id is not null or request_id is not null)
);

create table public.ai_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  enabled boolean not null default false,
  auto_categorize boolean not null default false,
  summarize_history boolean not null default false,
  weekly_digest boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.org_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  allow_magic_link boolean not null default true,
  allow_email_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.sync_work_order_totals()
returns trigger
language plpgsql
as $$
declare
  target_work_order_id uuid;
begin
  target_work_order_id := coalesce(new.work_order_id, old.work_order_id);

  update public.work_orders
  set
    labor_cost_total = coalesce((select sum(total_cost) from public.labor_entries where work_order_id = target_work_order_id), 0),
    material_cost_total = coalesce((select sum(total_cost) from public.material_entries where work_order_id = target_work_order_id), 0),
    total_cost =
      coalesce((select sum(total_cost) from public.labor_entries where work_order_id = target_work_order_id), 0) +
      coalesce((select sum(total_cost) from public.material_entries where work_order_id = target_work_order_id), 0),
    updated_at = now()
  where id = target_work_order_id;

  return coalesce(new, old);
end;
$$;

create or replace function public.create_work_order_from_request()
returns trigger
language plpgsql
security definer
as $$
declare
  created_work_order_id uuid;
begin
  insert into public.work_orders (
    organization_id,
    request_id,
    site_id,
    title,
    description,
    category_id,
    priority,
    status,
    building,
    floor,
    room,
    hallway,
    location_notes
  )
  values (
    new.organization_id,
    new.id,
    new.site_id,
    new.title,
    new.description,
    new.category_id,
    new.priority,
    'New',
    new.building,
    new.floor,
    new.room,
    new.hallway,
    new.location_notes
  );

  select id into created_work_order_id
  from public.work_orders
  where request_id = new.id;

  insert into public.work_order_status_history (work_order_id, from_status, to_status, changed_by_user_id, changed_at)
  values (created_work_order_id, null, 'New', new.requester_user_id, now());

  return new;
end;
$$;

create or replace function public.log_status_change()
returns trigger
language plpgsql
as $$
begin
  if old.status is distinct from new.status then
    insert into public.work_order_status_history (work_order_id, from_status, to_status, changed_by_user_id, changed_at)
    values (
      new.id,
      old.status,
      new.status,
      coalesce(
        auth.uid(),
        new.claimed_by_user_id,
        new.assigned_user_id,
        (select requester_user_id from public.requests where id = new.request_id)
      ),
      now()
    );
  end if;

  return new;
end;
$$;

create trigger work_orders_set_updated_at
before update on public.work_orders
for each row execute function public.handle_updated_at();

create trigger ai_settings_set_updated_at
before update on public.ai_settings
for each row execute function public.handle_updated_at();

create trigger org_settings_set_updated_at
before update on public.org_settings
for each row execute function public.handle_updated_at();

create trigger requests_create_work_order
after insert on public.requests
for each row execute function public.create_work_order_from_request();

create trigger work_orders_log_status
after update of status on public.work_orders
for each row execute function public.log_status_change();

create trigger labor_entries_sync_work_order_totals
after insert or update or delete on public.labor_entries
for each row execute function public.sync_work_order_totals();

create trigger material_entries_sync_work_order_totals
after insert or update or delete on public.material_entries
for each row execute function public.sync_work_order_totals();

create index idx_sites_organization_id on public.sites(organization_id);
create index idx_memberships_org_user on public.memberships(organization_id, user_id);
create index idx_requests_org_requester on public.requests(organization_id, requester_user_id);
create index idx_work_orders_org_status on public.work_orders(organization_id, status);
create index idx_work_orders_site_id on public.work_orders(site_id);
create index idx_work_orders_assigned_user_id on public.work_orders(assigned_user_id);
create index idx_work_orders_claimed_by_user_id on public.work_orders(claimed_by_user_id);
create index idx_work_orders_due_at on public.work_orders(due_at);
create index idx_status_history_work_order_id on public.work_order_status_history(work_order_id);
create index idx_comments_work_order_id on public.work_order_comments(work_order_id);
create index idx_labor_entries_work_order_id on public.labor_entries(work_order_id);
create index idx_material_entries_work_order_id on public.material_entries(work_order_id);
create index idx_attachments_org_id on public.attachments(organization_id);

alter table public.organizations enable row level security;
alter table public.sites enable row level security;
alter table public.memberships enable row level security;
alter table public.categories enable row level security;
alter table public.requests enable row level security;
alter table public.work_orders enable row level security;
alter table public.work_order_status_history enable row level security;
alter table public.work_order_comments enable row level security;
alter table public.labor_entries enable row level security;
alter table public.material_entries enable row level security;
alter table public.attachments enable row level security;
alter table public.ai_settings enable row level security;
alter table public.org_settings enable row level security;

create or replace function public.current_membership_role(target_org_id uuid)
returns public.app_role
language sql
stable
as $$
  select role
  from public.memberships
  where organization_id = target_org_id
    and user_id = auth.uid()
  limit 1
$$;

create or replace function public.is_org_member(target_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.memberships
    where organization_id = target_org_id
      and user_id = auth.uid()
  )
$$;

create policy "org members can read organizations"
on public.organizations for select
using (public.is_org_member(id));

create policy "org members can read sites"
on public.sites for select
using (public.is_org_member(organization_id));

create policy "admins manage sites"
on public.sites for all
using (public.current_membership_role(organization_id) = 'admin')
with check (public.current_membership_role(organization_id) = 'admin');

create policy "org members can read memberships"
on public.memberships for select
using (public.is_org_member(organization_id));

create policy "admins manage memberships"
on public.memberships for all
using (public.current_membership_role(organization_id) = 'admin')
with check (public.current_membership_role(organization_id) = 'admin');

create policy "org members can read categories"
on public.categories for select
using (public.is_org_member(organization_id));

create policy "admins manage categories"
on public.categories for all
using (public.current_membership_role(organization_id) = 'admin')
with check (public.current_membership_role(organization_id) = 'admin');

create policy "requesters create own requests"
on public.requests for insert
with check (
  requester_user_id = auth.uid()
  and public.is_org_member(organization_id)
);

create policy "requesters read own requests, staff read org requests"
on public.requests for select
using (
  requester_user_id = auth.uid()
  or public.current_membership_role(organization_id) in ('technician', 'manager', 'admin')
);

create policy "managers and admins update requests"
on public.requests for update
using (public.current_membership_role(organization_id) in ('manager', 'admin'));

create policy "requesters read linked work order progress only"
on public.work_orders for select
using (
  public.current_membership_role(organization_id) in ('manager', 'admin', 'technician')
  or exists (
    select 1 from public.requests
    where requests.id = work_orders.request_id
      and requests.requester_user_id = auth.uid()
  )
);

create policy "technicians managers admins update work orders"
on public.work_orders for update
using (public.current_membership_role(organization_id) in ('technician', 'manager', 'admin'));

create policy "org members read status history"
on public.work_order_status_history for select
using (
  exists (
    select 1 from public.work_orders
    where work_orders.id = work_order_status_history.work_order_id
      and public.is_org_member(work_orders.organization_id)
  )
);

create policy "technicians managers admins insert comments"
on public.work_order_comments for insert
with check (
  exists (
    select 1 from public.work_orders
    where work_orders.id = work_order_comments.work_order_id
      and public.current_membership_role(work_orders.organization_id) in ('technician', 'manager', 'admin')
  )
);

create policy "org members read comments"
on public.work_order_comments for select
using (
  exists (
    select 1 from public.work_orders
    where work_orders.id = work_order_comments.work_order_id
      and public.is_org_member(work_orders.organization_id)
  )
);

create policy "technicians managers admins manage labor entries"
on public.labor_entries for all
using (
  exists (
    select 1 from public.work_orders
    where work_orders.id = labor_entries.work_order_id
      and public.current_membership_role(work_orders.organization_id) in ('technician', 'manager', 'admin')
  )
)
with check (
  exists (
    select 1 from public.work_orders
    where work_orders.id = labor_entries.work_order_id
      and public.current_membership_role(work_orders.organization_id) in ('technician', 'manager', 'admin')
  )
);

create policy "technicians managers admins manage material entries"
on public.material_entries for all
using (
  exists (
    select 1 from public.work_orders
    where work_orders.id = material_entries.work_order_id
      and public.current_membership_role(work_orders.organization_id) in ('technician', 'manager', 'admin')
  )
)
with check (
  exists (
    select 1 from public.work_orders
    where work_orders.id = material_entries.work_order_id
      and public.current_membership_role(work_orders.organization_id) in ('technician', 'manager', 'admin')
  )
);

create policy "org members read attachments"
on public.attachments for select
using (public.is_org_member(organization_id));

create policy "technicians managers admins insert attachments"
on public.attachments for insert
with check (public.current_membership_role(organization_id) in ('technician', 'manager', 'admin'));

create policy "admins manage ai settings"
on public.ai_settings for all
using (public.current_membership_role(organization_id) = 'admin')
with check (public.current_membership_role(organization_id) = 'admin');

create policy "org members read ai settings"
on public.ai_settings for select
using (public.is_org_member(organization_id));

create policy "admins manage org settings"
on public.org_settings for all
using (public.current_membership_role(organization_id) = 'admin')
with check (public.current_membership_role(organization_id) = 'admin');

create policy "org members read org settings"
on public.org_settings for select
using (public.is_org_member(organization_id));

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "org members can read attachment objects"
on storage.objects for select
using (
  bucket_id = 'attachments'
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

create policy "staff can insert attachment objects"
on storage.objects for insert
with check (
  bucket_id = 'attachments'
  and public.current_membership_role((storage.foldername(name))[1]::uuid) in ('technician', 'manager', 'admin')
);
