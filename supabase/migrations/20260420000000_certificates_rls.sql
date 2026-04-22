-- Enable RLS on certificates if not already enabled
alter table public.certificates enable row level security;

-- Policies for public.certificates

-- 1. Admins, Professors, and Masters can view all certificates
create policy "Admins can view all certificates"
  on public.certificates for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'professor', 'master')
    )
  );

-- 2. Students can view their own certificates
create policy "Users can view own certificates"
  on public.certificates for select
  using ( auth.uid() = user_id );

-- 3. Authenticated users can insert their own certificates (when issuing)
create policy "Users can insert own certificates"
  on public.certificates for insert
  with check ( auth.uid() = user_id );

-- 4. Admins can manage all certificates
create policy "Admins can manage certificates"
  on public.certificates for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'professor', 'master')
    )
  );
