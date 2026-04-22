-- Fix for certificate RLS policies
-- Problem: 'admin' is NOT a valid role (constraint allows: master, professor, manager, student)
-- Fix: Replace 'admin' with 'manager' and include it in all admin-level certificate policies

-- Drop the old policies with incorrect role check
DROP POLICY IF EXISTS "Admins can view all certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can insert own certificates" ON public.certificates;

-- 1. Admins (master + manager) and professors can view ALL certificates
CREATE POLICY "Admins can view all certificates"
  ON public.certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('master', 'manager', 'professor')
    )
  );

-- 2. Admins (master + manager) can manage (insert/update/delete) all certificates
CREATE POLICY "Admins can manage certificates"
  ON public.certificates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('master', 'manager', 'professor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('master', 'manager', 'professor')
    )
  );

-- 3. Students can insert their own certificates (when eligibility is met)
CREATE POLICY "Users can insert own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK ( auth.uid() = user_id );
