-- 1. Create Institutions table (The Tenant)
create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text unique, -- For subdomains or custom domains
  brand_colors jsonb default '{"primary": "#000000", "secondary": "#ffffff"}'::jsonb,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Profiles table (Extending Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  institution_id uuid references public.institutions(id) on delete set null,
  full_name text,
  role text check (role in ('master', 'professor', 'manager', 'student')) default 'student',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.institutions enable row level security;
alter table public.profiles enable row level security;

-- 4. Sample RLS Policy for Institutions (Viewable by members or master)
create policy "Institutions are viewable by authenticated users"
  on public.institutions for select
  using ( auth.role() = 'authenticated' );

-- 5. Profiles RLS (Users can view their own profile or masters can see all)
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );
