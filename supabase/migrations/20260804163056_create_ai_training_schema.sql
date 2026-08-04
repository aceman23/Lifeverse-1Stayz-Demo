/*
  # AI Training — Internal Chatbots, Documents & Guardrails

  ## Overview
  Adds three new tables that let a church admin manage their own internal AI
  chatbots: train them with proprietary documents (sermons, policies, core
  messaging), and set guardrails that constrain the AI's behavior.

  ## New Tables

  ### 1. ai_bots
  Represents an internal AI chatbot configured by the church admin.
  - id (uuid, primary key)
  - name (text) — e.g. "Grace", "Welcome Assistant", "Prayer Companion"
  - description (text, nullable)
  - persona_prompt (text) — system prompt defining the bot's personality
  - status (text) — 'draft', 'training', 'active', 'paused'
  - model (text, default 'gpt-4o')
  - tone_warmth (integer, 0-100)
  - tone_directness (integer, 0-100)
  - tone_formality (integer, 0-100)
  - scripture_use (integer, 0-100)
  - document_count (integer, default 0)
  - guardrail_count (integer, default 0)
  - last_trained_at (timestamptz, nullable)
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())

  ### 2. ai_documents
  Training documents uploaded by the admin for a specific bot.
  - id (uuid, primary key)
  - bot_id (uuid, FK to ai_bots, ON DELETE CASCADE)
  - title (text)
  - file_type (text) — 'pdf', 'docx', 'txt', 'md', 'url', 'sermon_notes'
  - file_size_kb (integer, nullable)
  - content_summary (text, nullable)
  - status (text) — 'pending', 'processing', 'indexed', 'failed'
  - tags (text[], default '{}')
  - uploaded_by (text, nullable) — admin name
  - created_at (timestamptz, default now())

  ### 3. ai_guardrails
  Guardrail rules that constrain the AI's behavior for a specific bot.
  - id (uuid, primary key)
  - bot_id (uuid, FK to ai_bots, ON DELETE CASCADE)
  - rule_type (text) — 'blocked_topic', 'required_response', 'escalation_trigger', 'tone_constraint', 'content_boundary'
  - rule_text (text) — the actual rule description
  - severity (text) — 'low', 'medium', 'high', 'critical'
  - is_active (boolean, default true)
  - created_at (timestamptz, default now())

  ## Security
  - RLS enabled on all three tables.
  - Anon + authenticated can read (demo mode support, matching existing tables).
  - Authenticated users can insert/update/delete.
  - Anon can insert (for demo mode interactions).

  ## Seed Data
  Seeds one default bot ("Grace — Pastoral Care Assistant") with 5 training
  documents and 6 guardrail rules covering common church AI safety scenarios.
*/

-- ============================================================
-- AI BOTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  persona_prompt text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  model text NOT NULL DEFAULT 'gpt-4o',
  tone_warmth integer DEFAULT 80,
  tone_directness integer DEFAULT 50,
  tone_formality integer DEFAULT 30,
  scripture_use integer DEFAULT 60,
  document_count integer DEFAULT 0,
  guardrail_count integer DEFAULT 0,
  last_trained_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_bots ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Anon users can read ai_bots') THEN
    CREATE POLICY "Anon users can read ai_bots" ON ai_bots FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Authenticated users can read ai_bots') THEN
    CREATE POLICY "Authenticated users can read ai_bots" ON ai_bots FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Authenticated users can insert ai_bots') THEN
    CREATE POLICY "Authenticated users can insert ai_bots" ON ai_bots FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Authenticated users can update ai_bots') THEN
    CREATE POLICY "Authenticated users can update ai_bots" ON ai_bots FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Authenticated users can delete ai_bots') THEN
    CREATE POLICY "Authenticated users can delete ai_bots" ON ai_bots FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Anon users can insert ai_bots') THEN
    CREATE POLICY "Anon users can insert ai_bots" ON ai_bots FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Anon users can update ai_bots') THEN
    CREATE POLICY "Anon users can update ai_bots" ON ai_bots FOR UPDATE TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_bots' AND policyname='Anon users can delete ai_bots') THEN
    CREATE POLICY "Anon users can delete ai_bots" ON ai_bots FOR DELETE TO anon USING (true);
  END IF;
END $$;

-- ============================================================
-- AI DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id uuid NOT NULL REFERENCES ai_bots(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_type text NOT NULL DEFAULT 'txt',
  file_size_kb integer,
  content_summary text,
  status text NOT NULL DEFAULT 'pending',
  tags text[] DEFAULT '{}',
  uploaded_by text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Anon users can read ai_documents') THEN
    CREATE POLICY "Anon users can read ai_documents" ON ai_documents FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Authenticated users can read ai_documents') THEN
    CREATE POLICY "Authenticated users can read ai_documents" ON ai_documents FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Authenticated users can insert ai_documents') THEN
    CREATE POLICY "Authenticated users can insert ai_documents" ON ai_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Authenticated users can update ai_documents') THEN
    CREATE POLICY "Authenticated users can update ai_documents" ON ai_documents FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Authenticated users can delete ai_documents') THEN
    CREATE POLICY "Authenticated users can delete ai_documents" ON ai_documents FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Anon users can insert ai_documents') THEN
    CREATE POLICY "Anon users can insert ai_documents" ON ai_documents FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Anon users can update ai_documents') THEN
    CREATE POLICY "Anon users can update ai_documents" ON ai_documents FOR UPDATE TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_documents' AND policyname='Anon users can delete ai_documents') THEN
    CREATE POLICY "Anon users can delete ai_documents" ON ai_documents FOR DELETE TO anon USING (true);
  END IF;
END $$;

-- ============================================================
-- AI GUARDRAILS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_guardrails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id uuid NOT NULL REFERENCES ai_bots(id) ON DELETE CASCADE,
  rule_type text NOT NULL DEFAULT 'blocked_topic',
  rule_text text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_guardrails ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Anon users can read ai_guardrails') THEN
    CREATE POLICY "Anon users can read ai_guardrails" ON ai_guardrails FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Authenticated users can read ai_guardrails') THEN
    CREATE POLICY "Authenticated users can read ai_guardrails" ON ai_guardrails FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Authenticated users can insert ai_guardrails') THEN
    CREATE POLICY "Authenticated users can insert ai_guardrails" ON ai_guardrails FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Authenticated users can update ai_guardrails') THEN
    CREATE POLICY "Authenticated users can update ai_guardrails" ON ai_guardrails FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Authenticated users can delete ai_guardrails') THEN
    CREATE POLICY "Authenticated users can delete ai_guardrails" ON ai_guardrails FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Anon users can insert ai_guardrails') THEN
    CREATE POLICY "Anon users can insert ai_guardrails" ON ai_guardrails FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Anon users can update ai_guardrails') THEN
    CREATE POLICY "Anon users can update ai_guardrails" ON ai_guardrails FOR UPDATE TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_guardrails' AND policyname='Anon users can delete ai_guardrails') THEN
    CREATE POLICY "Anon users can delete ai_guardrails" ON ai_guardrails FOR DELETE TO anon USING (true);
  END IF;
END $$;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ai_documents_bot_id ON ai_documents(bot_id);
CREATE INDEX IF NOT EXISTS idx_ai_guardrails_bot_id ON ai_guardrails(bot_id);

-- ============================================================
-- SEED DATA
-- ============================================================
DO $$
DECLARE
  v_bot_id uuid;
BEGIN
  -- Create the default Grace bot
  v_bot_id := gen_random_uuid();
  INSERT INTO ai_bots (id, name, description, persona_prompt, status, model, tone_warmth, tone_directness, tone_formality, scripture_use, document_count, guardrail_count, last_trained_at)
  VALUES (
    v_bot_id,
    'Grace — Pastoral Care Assistant',
    'Primary AI assistant for visitor engagement, follow-up conversations, and pastoral care support.',
    'You are Grace, a warm and compassionate pastoral care assistant at My Sanctuary church. Your role is to welcome visitors, listen with empathy, answer questions about the church, and connect people with the right resources. You speak with warmth and gentleness, never pushy. You reference scripture when directly relevant. You always prioritize the person''s wellbeing and escalate concerns to pastors when appropriate.',
    'active',
    'gpt-4o',
    92,
    54,
    31,
    65,
    5,
    6,
    now() - interval '2 days'
  );

  -- Seed training documents
  INSERT INTO ai_documents (bot_id, title, file_type, file_size_kb, content_summary, status, tags, uploaded_by, created_at) VALUES
  (v_bot_id, 'Church Mission & Vision Statement', 'pdf', 245, 'Core mission, vision, and values of My Sanctuary church. Defines the church''s purpose and guiding principles.', 'indexed', ARRAY['core', 'mission', 'values'], 'Pastor James', now() - interval '5 days'),
  (v_bot_id, 'Sermon Series: Finding Hope in Hard Times', 'docx', 1820, '6-week sermon series on finding hope through difficult seasons. Includes key scriptures, themes, and pastoral care guidance.', 'indexed', ARRAY['sermons', 'hope', 'pastoral-care'], 'Pastor James', now() - interval '4 days'),
  (v_bot_id, 'Visitor Welcome Guide', 'pdf', 510, 'Comprehensive guide for new visitors including service times, programs, small groups, baptism process, and membership steps.', 'indexed', ARRAY['welcome', 'visitor', 'programs'], 'Admin Sarah', now() - interval '4 days'),
  (v_bot_id, 'Pastoral Care Policies & Procedures', 'pdf', 380, 'Internal policies for pastoral care including confidentiality, crisis response protocols, and when to escalate to professional counseling.', 'indexed', ARRAY['policy', 'pastoral-care', 'crisis'], 'Pastor James', now() - interval '3 days'),
  (v_bot_id, 'Core Messaging & FAQ', 'md', 95, 'Approved language for common questions about salvation, baptism, tithing, membership, and church events. Ensures consistent messaging across all channels.', 'indexed', ARRAY['messaging', 'faq', 'approved'], 'Admin Sarah', now() - interval '3 days');

  -- Seed guardrails
  INSERT INTO ai_guardrails (bot_id, rule_type, rule_text, severity, is_active, created_at) VALUES
  (v_bot_id, 'escalation_trigger', 'If a visitor expresses suicidal thoughts, self-harm, or crisis, immediately provide the 988 Crisis Lifeline number and notify a pastor. Do not attempt to counsel crisis situations.', 'critical', true, now() - interval '5 days'),
  (v_bot_id, 'blocked_topic', 'Never provide specific financial advice, investment recommendations, or counseling on debt management. Refer to a pastor or financial counselor.', 'high', true, now() - interval '5 days'),
  (v_bot_id, 'blocked_topic', 'Never make theological declarations or interpret scripture as absolute truth on debated doctrinal issues (e.g. Calvinism vs Arminianism, eschatology). Present multiple perspectives and defer to pastors.', 'high', true, now() - interval '5 days'),
  (v_bot_id, 'required_response', 'Always introduce yourself as "Grace, a pastoral care assistant" and clarify you are an AI assistant, not a licensed counselor or pastor.', 'medium', true, now() - interval '5 days'),
  (v_bot_id, 'content_boundary', 'Do not store or repeat confidential information shared by other visitors. Each conversation is private and independent.', 'high', true, now() - interval '5 days'),
  (v_bot_id, 'tone_constraint', 'Maintain a warm, non-judgmental tone at all times. Never use language that could be interpreted as condemning, dismissive, or preachy.', 'medium', true, now() - interval '5 days');
END $$;
