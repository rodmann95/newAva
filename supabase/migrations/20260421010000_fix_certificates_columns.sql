-- ============================================================
-- FIX: certificates table missing created_at column
-- ============================================================

-- 1. Add created_at column if it doesn't exist
ALTER TABLE public.certificates 
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. If there's an issued_at column (common alternative), copy it over
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'certificates'
    AND column_name = 'issued_at'
  ) THEN
    UPDATE public.certificates 
    SET created_at = issued_at
    WHERE created_at IS NULL AND issued_at IS NOT NULL;
  END IF;
END $$;

-- 3. Verify the certificates table structure (useful for debugging — run and check results)
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'certificates'
ORDER BY ordinal_position;
