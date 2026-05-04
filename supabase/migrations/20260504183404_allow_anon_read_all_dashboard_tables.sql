/*
  # Allow anon role to read all dashboard tables

  Every table queried by the dashboard hooks is locked to `authenticated` only.
  This migration adds anon SELECT policies so the dashboard renders data without
  requiring a real login session (demo mode support).

  Tables affected: concerns, communication_events, follow_up_sequences,
  visit_events, escalations, meeting_invitations, concern_revisions
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='concerns' AND policyname='Anon users can read concerns') THEN
    CREATE POLICY "Anon users can read concerns" ON concerns FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='communication_events' AND policyname='Anon users can read communication_events') THEN
    CREATE POLICY "Anon users can read communication_events" ON communication_events FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='follow_up_sequences' AND policyname='Anon users can read follow_up_sequences') THEN
    CREATE POLICY "Anon users can read follow_up_sequences" ON follow_up_sequences FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='visit_events' AND policyname='Anon users can read visit_events') THEN
    CREATE POLICY "Anon users can read visit_events" ON visit_events FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='escalations' AND policyname='Anon users can read escalations') THEN
    CREATE POLICY "Anon users can read escalations" ON escalations FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meeting_invitations' AND policyname='Anon users can read meeting_invitations') THEN
    CREATE POLICY "Anon users can read meeting_invitations" ON meeting_invitations FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='concern_revisions' AND policyname='Anon users can read concern_revisions') THEN
    CREATE POLICY "Anon users can read concern_revisions" ON concern_revisions FOR SELECT TO anon USING (true);
  END IF;
END $$;
