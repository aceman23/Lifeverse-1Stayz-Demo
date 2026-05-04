/*
  # Allow anon role to read visitors and pastors

  The existing SELECT policies are scoped to `authenticated` only, which means
  unauthenticated / demo-mode users cannot read any data. This migration adds
  matching anon-read policies so the dashboard loads without a real login session.

  1. Changes
    - Add SELECT policy for `anon` role on `visitors`
    - Add SELECT policy for `anon` role on `pastors`
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'visitors' AND policyname = 'Anon users can read visitors'
  ) THEN
    CREATE POLICY "Anon users can read visitors"
      ON visitors FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pastors' AND policyname = 'Anon users can read pastors'
  ) THEN
    CREATE POLICY "Anon users can read pastors"
      ON pastors FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;
