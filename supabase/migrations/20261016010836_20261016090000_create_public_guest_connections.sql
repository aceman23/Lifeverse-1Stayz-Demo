/*
# Create public guest connection submissions

1. New Tables
- `public_guest_connections`
- `id` (uuid primary key)
- `church_slug` (text identifier from the public connection URL)
- `first_name` and `last_name` (guest name)
- `email` (guest email address)
- `mobile` (optional guest mobile number)
- `which_service` (service selected on the connection card)
- `sms_consent` (whether the guest opted into SMS)
- `sms_consent_at` (timestamp captured only when consent is true)
- `consent_wording_version` (version of the wording shown at submission)
- `created_at` (submission timestamp)

2. Security
- Row level security is enabled.
- Anonymous and authenticated visitors may insert a connection card.
- Direct reads, updates, and deletes are denied so public visitors cannot enumerate or alter guest submissions.
- Staff workflows can be added later through a protected server function without exposing the intake table publicly.

3. Important Notes
- The table intentionally accepts submissions without login.
- SMS consent is stored as a boolean, timestamp, and wording version for auditable opt-in records.
- The mobile number remains optional and is not required when SMS consent is unchecked.
*/

CREATE TABLE IF NOT EXISTS public.public_guest_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  church_slug text NOT NULL CHECK (church_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  first_name text NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 100),
  last_name text NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 320),
  mobile text,
  which_service text NOT NULL CHECK (char_length(which_service) BETWEEN 1 AND 120),
  sms_consent boolean NOT NULL DEFAULT false,
  sms_consent_at timestamptz,
  consent_wording_version text NOT NULL DEFAULT '2026-10-16-v1',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sms_consent_timestamp_check CHECK ((sms_consent = false AND sms_consent_at IS NULL) OR (sms_consent = true AND sms_consent_at IS NOT NULL))
);

ALTER TABLE public.public_guest_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can submit connection cards" ON public.public_guest_connections;
CREATE POLICY "Public visitors can submit connection cards"
  ON public.public_guest_connections FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public visitors cannot read connection cards" ON public.public_guest_connections;
CREATE POLICY "Public visitors cannot read connection cards"
  ON public.public_guest_connections FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Public visitors cannot update connection cards" ON public.public_guest_connections;
CREATE POLICY "Public visitors cannot update connection cards"
  ON public.public_guest_connections FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Public visitors cannot delete connection cards" ON public.public_guest_connections;
CREATE POLICY "Public visitors cannot delete connection cards"
  ON public.public_guest_connections FOR DELETE
  TO anon, authenticated
  USING (false);

CREATE INDEX IF NOT EXISTS idx_public_guest_connections_church_slug
  ON public.public_guest_connections(church_slug);
CREATE INDEX IF NOT EXISTS idx_public_guest_connections_created_at
  ON public.public_guest_connections(created_at DESC);
