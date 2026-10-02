-- profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  client_name text not null,
  contract_amount numeric(12,2) not null default 0,
  start_date date,
  end_date date,
  status text not null default 'Planning',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- project_budgets table
create table public.project_budgets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  materials numeric(12,2) not null default 0,
  labor numeric(12,2) not null default 0,
  equipment numeric(12,2) not null default 0,
  other numeric(12,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (project_id)
);

-- expenses table
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  description text,
  amount numeric(12,2) not null,
  expense_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- payments table
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  payment_date date not null default current_date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- indexes
create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_status on public.projects(status);
create index idx_expenses_project_id on public.expenses(project_id);
create index idx_payments_project_id on public.payments(project_id);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_budgets enable row level security;
alter table public.expenses enable row level security;
alter table public.payments enable row level security;

-- profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- projects policies
create policy "Users can view own projects" on public.projects
  for select using (auth.uid() = user_id);

create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- project_budgets policies
create policy "Users can view budgets for own projects" on public.project_budgets
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_budgets.project_id
      and p.user_id = auth.uid()
    )
  );

create policy "Users can insert budgets for own projects" on public.project_budgets
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = project_budgets.project_id
      and p.user_id = auth.uid()
    )
  );

create policy "Users can update budgets for own projects" on public.project_budgets
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = project_budgets.project_id
      and p.user_id = auth.uid()
    )
  );

create policy "Users can delete budgets for own projects" on public.project_budgets
  for delete using (
    exists (
      select 1 from public.projects p
      where p.id = project_budgets.project_id
      and p.user_id = auth.uid()
    )
  );

-- expenses policies
create policy "Users can view expenses for own projects" on public.expenses
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = expenses.project_id
      and p.user_id = auth.uid()
    )
  );

create policy "Users can insert expenses for own projects" on public.expenses
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = expenses.project_id
      and p.user_id = auth.uid()
    )
  );

create policy "Users can update own expenses" on public.expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete own expenses" on public.expenses
  for delete using (auth.uid() = user_id);

-- payments policies
create policy "Users can view payments for own projects" on public.payments
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = payments.project_id
      and p.user_id = auth.uid()
    )
  );

create policy "Users can insert payments for own projects" on public.payments
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = payments.project_id
      and p.user_id = auth.uid()
    )
  );

create policy "Users can update own payments" on public.payments
  for update using (auth.uid() = user_id);

create policy "Users can delete own payments" on public.payments
  for delete using (auth.uid() = user_id);

-- trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end $$;

-- updated_at triggers
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger project_budgets_updated_at
  before update on public.project_budgets
  for each row execute procedure public.handle_updated_at();

create trigger expenses_updated_at
  before update on public.expenses
  for each row execute procedure public.handle_updated_at();

create trigger payments_updated_at
  before update on public.payments
  for each row execute procedure public.handle_updated_at();