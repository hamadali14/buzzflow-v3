create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'staff');
create type public.form_status as enum ('draft', 'published', 'paused', 'archived');
create type public.entry_state as enum ('unread', 'read', 'handled', 'spam', 'duplicate');
create type public.lead_status as enum ('new', 'unqualified', 'qualified', 'contacted', 'waiting_reply', 'warm', 'cold', 'offer', 'won', 'lost', 'archived');
create type public.customer_status as enum ('active', 'paused', 'closed', 'blocked', 'archived');
create type public.invoice_status as enum ('draft', 'ready', 'sent', 'partial', 'paid', 'late', 'cancelled');
create type public.task_status as enum ('todo', 'doing', 'waiting', 'done', 'blocked', 'cancelled');
create type public.task_priority as enum ('low', 'medium', 'high');
create type public.communication_type as enum ('call', 'meeting', 'email', 'note', 'comment', 'follow_up');
create type public.activity_entity as enum ('form', 'entry', 'lead', 'customer', 'invoice', 'task', 'file', 'communication', 'user', 'settings');

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name public.app_role unique not null,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key,
  email text unique not null,
  full_name text,
  role_id uuid references public.roles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status public.form_status not null default 'draft',
  active_version_id uuid,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_versions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  version_number integer not null,
  schema jsonb not null default '{}'::jsonb,
  style_config jsonb not null default '{}'::jsonb,
  logic_config jsonb not null default '{}'::jsonb,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(form_id, version_number)
);

alter table public.forms
  add constraint forms_active_version_fk
  foreign key (active_version_id) references public.form_versions(id);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_version_id uuid not null references public.form_versions(id) on delete cascade,
  field_key text not null,
  label text not null,
  field_type text not null,
  position integer not null,
  required boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  conditional_logic jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(form_version_id, field_key)
);

create table public.form_publications (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  form_version_id uuid not null references public.form_versions(id) on delete cascade,
  public_token text unique not null,
  endpoint_path text unique not null,
  is_paused boolean not null default false,
  published_by uuid references public.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_entries (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id),
  form_version_id uuid references public.form_versions(id),
  publication_id uuid references public.form_publications(id),
  state public.entry_state not null default 'unread',
  contact_name text,
  email text,
  phone text,
  raw_payload jsonb not null,
  validation_errors jsonb,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  form_entry_id uuid unique references public.form_entries(id),
  customer_id uuid,
  full_name text not null,
  company_name text,
  email text,
  phone text,
  source text,
  status public.lead_status not null default 'new',
  priority public.task_priority not null default 'medium',
  score integer not null default 0,
  estimated_value numeric(12,2) not null default 0,
  owner_id uuid references public.users(id),
  next_step text,
  tags text[] not null default '{}',
  qualification_flags jsonb not null default '[]'::jsonb,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  old_status public.lead_status,
  new_status public.lead_status not null,
  changed_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid unique references public.leads(id),
  name text not null,
  primary_contact_name text,
  status public.customer_status not null default 'active',
  billing_currency text not null default 'SEK',
  total_billed numeric(12,2) not null default 0,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads
  add constraint leads_customer_fk
  foreign key (customer_id) references public.customers(id);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  invoice_number text unique not null,
  amount numeric(12,2) not null,
  currency text not null default 'SEK',
  due_date date not null,
  status public.invoice_status not null default 'draft',
  paid_amount numeric(12,2) not null default 0,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.communications (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  task_id uuid,
  type public.communication_type not null,
  title text not null,
  body text,
  owner_id uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  entry_id uuid references public.form_entries(id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  owner_id uuid references public.users(id),
  due_at timestamptz,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.communications
  add constraint communications_task_fk
  foreign key (task_id) references public.tasks(id) on delete cascade;

create table public.files (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete cascade,
  entry_id uuid references public.form_entries(id) on delete cascade,
  bucket_path text not null,
  file_name text not null,
  file_type text,
  file_size_bytes bigint,
  uploaded_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type public.activity_entity not null,
  entity_id uuid not null,
  action text not null,
  actor_id uuid references public.users(id),
  old_value jsonb,
  new_value jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.roles (name)
values ('admin'), ('staff')
on conflict (name) do nothing;
