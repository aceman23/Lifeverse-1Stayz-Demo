/*
# Create private AI provider settings

1. New Tables
- `ai_provider_settings`
- `id` (uuid primary key)
- `user_id` (uuid owner, defaults to the signed-in user)
- `provider` (text: openai, anthropic, or google)
- `model` (text model identifier)
- `api_key` (text provider credential, never returned to the browser)
- `key_last4` (text masked display value)
- `enabled` (boolean)
- `created_at` and `updated_at` timestamps

2. Security
- Row level security is enabled.
- Direct browser access is denied for every CRUD operation, including reads.
- The AI settings and chat Edge Functions use the service role only after validating the caller's signed-in identity.

3. Important Notes
- Provider credentials are stored server-side and are never placed in local storage or included in chat responses.
- One provider configuration is allowed per signed-in user.
- Demo mode can preview the interface but cannot save provider credentials without a signed-in account.
*/

CREATE TABLE IF NOT EXISTS public.ai_provider_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
  model text NOT NULL,
  api_key text NOT NULL,
  key_last4 text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

ALTER TABLE public.ai_provider_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny direct provider settings reads" ON public.ai_provider_settings;
CREATE POLICY "Deny direct provider settings reads" ON public.ai_provider_settings
  FOR SELECT TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "Deny direct provider settings inserts" ON public.ai_provider_settings;
CREATE POLICY "Deny direct provider settings inserts" ON public.ai_provider_settings
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "Deny direct provider settings updates" ON public.ai_provider_settings;
CREATE POLICY "Deny direct provider settings updates" ON public.ai_provider_settings
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Deny direct provider settings deletes" ON public.ai_provider_settings;
CREATE POLICY "Deny direct provider settings deletes" ON public.ai_provider_settings
  FOR DELETE TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_ai_provider_settings_user_id
  ON public.ai_provider_settings(user_id);
