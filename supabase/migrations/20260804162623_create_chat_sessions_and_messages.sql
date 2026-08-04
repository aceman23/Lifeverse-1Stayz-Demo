/*
  # Chat Sessions & Messages — AI Conversation Inbox

  ## Overview
  Adds two new tables to track AI chatbot conversations with visitors and
  allow human pastors to view, intervene, and take over those conversations
  in real time.

  ## New Tables

  ### 1. chat_sessions
  Represents a single conversation thread between a visitor and the AI
  chatbot (Grace) on a digital channel (web chat, SMS, WhatsApp, etc.).
  - id (uuid, primary key)
  - visitor_id (uuid, FK to visitors)
  - channel (text) — the digital medium: 'web_chat', 'sms', 'whatsapp', 'email'
  - status (text) — 'active', 'paused', 'ended', 'taken_over'
  - ai_active (boolean, default true) — whether the AI is still responding
  - taken_over_by (uuid, FK to pastors, nullable) — which pastor took over
  - taken_over_at (timestamptz, nullable)
  - summary (text, nullable) — AI-generated summary of the conversation
  - outcome (text, nullable) — resolved outcome: 'resolved', 'escalated', 'no_action', 'follow_up'
  - sentiment (text, default 'neutral') — overall conversation sentiment
  - message_count (integer, default 0)
  - started_at (timestamptz, default now())
  - last_message_at (timestamptz, default now())
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())

  ### 2. chat_messages
  Individual messages within a chat session.
  - id (uuid, primary key)
  - session_id (uuid, FK to chat_sessions, ON DELETE CASCADE)
  - sender_type (text) — 'visitor', 'ai', 'pastor'
  - sender_pastor_id (uuid, FK to pastors, nullable) — set when sender_type = 'pastor'
  - content (text)
  - sentiment (text, default 'neutral')
  - metadata (jsonb, default '{}') — flags like { flagged: true, escalation_trigger: 'crisis' }
  - created_at (timestamptz, default now())

  ## Security
  - RLS enabled on both tables.
  - Anon + authenticated can read (demo mode support, matching existing tables).
  - Authenticated users can insert/update (pastors intervening).
  - Anon can insert chat_messages (visitor messages from the chatbot widget).

  ## Seed Data
  Seeds realistic chat sessions and messages for the 5 existing visitors,
  including one active conversation, one escalated conversation, one
  taken-over conversation, and one resolved conversation.
*/

-- ============================================================
-- CHAT SESSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'web_chat',
  status text NOT NULL DEFAULT 'active',
  ai_active boolean NOT NULL DEFAULT true,
  taken_over_by uuid REFERENCES pastors(id),
  taken_over_at timestamptz,
  summary text,
  outcome text,
  sentiment text DEFAULT 'neutral',
  message_count integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Anon + authenticated read (demo mode)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Anon users can read chat_sessions') THEN
    CREATE POLICY "Anon users can read chat_sessions" ON chat_sessions FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Authenticated users can read chat_sessions') THEN
    CREATE POLICY "Authenticated users can read chat_sessions" ON chat_sessions FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Authenticated insert/update
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Authenticated users can insert chat_sessions') THEN
    CREATE POLICY "Authenticated users can insert chat_sessions" ON chat_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Authenticated users can update chat_sessions') THEN
    CREATE POLICY "Authenticated users can update chat_sessions" ON chat_sessions FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Anon insert (chatbot widget creates sessions)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Anon users can insert chat_sessions') THEN
    CREATE POLICY "Anon users can insert chat_sessions" ON chat_sessions FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

-- Anon update (chatbot updates last_message_at etc.)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Anon users can update chat_sessions') THEN
    CREATE POLICY "Anon users can update chat_sessions" ON chat_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- CHAT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type text NOT NULL DEFAULT 'visitor',
  sender_pastor_id uuid REFERENCES pastors(id),
  content text NOT NULL,
  sentiment text DEFAULT 'neutral',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Anon + authenticated read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_messages' AND policyname='Anon users can read chat_messages') THEN
    CREATE POLICY "Anon users can read chat_messages" ON chat_messages FOR SELECT TO anon USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_messages' AND policyname='Authenticated users can read chat_messages') THEN
    CREATE POLICY "Authenticated users can read chat_messages" ON chat_messages FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Authenticated insert/update
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_messages' AND policyname='Authenticated users can insert chat_messages') THEN
    CREATE POLICY "Authenticated users can insert chat_messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_messages' AND policyname='Authenticated users can update chat_messages') THEN
    CREATE POLICY "Authenticated users can update chat_messages" ON chat_messages FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Anon insert (visitor messages from chatbot widget)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_messages' AND policyname='Anon users can insert chat_messages') THEN
    CREATE POLICY "Anon users can insert chat_messages" ON chat_messages FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor_id ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message ON chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Get the pastor id for take-over scenarios
DO $$
DECLARE
  v_pastor_id uuid;
  v_sarah_id uuid := '00000000-0000-0000-0001-000000000001';
  v_michael_id uuid := '00000000-0000-0000-0001-000000000002';
  v_rachel_id uuid := '00000000-0000-0000-0001-000000000003';
  v_james_id uuid := '00000000-0000-0000-0001-000000000004';
  v_maria_id uuid := '00000000-0000-0000-0001-000000000005';
  v_session1 uuid;
  v_session2 uuid;
  v_session3 uuid;
  v_session4 uuid;
  v_session5 uuid;
BEGIN
  SELECT id INTO v_pastor_id FROM pastors LIMIT 1;

  -- Session 1: Sarah Johnson — active web chat, AI handling
  v_session1 := gen_random_uuid();
  INSERT INTO chat_sessions (id, visitor_id, channel, status, ai_active, sentiment, message_count, summary, outcome, started_at, last_message_at)
  VALUES (v_session1, v_sarah_id, 'web_chat', 'active', true, 'warm', 6,
    'Sarah is asking about community groups and small gatherings. She seems eager to connect.',
    null,
    now() - interval '25 minutes',
    now() - interval '2 minutes');

  INSERT INTO chat_messages (session_id, sender_type, content, sentiment, created_at) VALUES
  (v_session1, 'ai', 'Hi Sarah! I''m Grace, a pastoral care assistant at My Sanctuary. It was wonderful having you join us on Sunday — how are you feeling about your visit?', 'warm', now() - interval '25 minutes'),
  (v_session1, 'visitor', 'I really enjoyed it! The message really spoke to me. I''ve been looking for a community for a while.', 'positive', now() - interval '23 minutes'),
  (v_session1, 'ai', 'That''s so wonderful to hear, Sarah! We''re so glad you found us. What kind of community are you hoping to find?', 'warm', now() - interval '22 minutes'),
  (v_session1, 'visitor', 'Something small, where people actually know each other. I''ve felt a bit disconnected at bigger churches.', 'neutral', now() - interval '20 minutes'),
  (v_session1, 'ai', 'I completely understand. We have several small groups that might be perfect for you. Based on what you''ve shared, I think you''d love our Young Adults group — they meet Thursday evenings and are a warm, welcoming bunch. Would you like me to send you the details?', 'inviting', now() - interval '18 minutes'),
  (v_session1, 'visitor', 'Yes, that sounds great! I''d love the details.', 'positive', now() - interval '2 minutes');

  -- Session 2: Michael Bennett — escalated concern, AI paused
  v_session2 := gen_random_uuid();
  INSERT INTO chat_sessions (id, visitor_id, channel, status, ai_active, sentiment, message_count, summary, outcome, started_at, last_message_at)
  VALUES (v_session2, v_michael_id, 'sms', 'paused', false, 'critical', 8,
    'Michael expressed feelings of deep isolation and hopelessness. AI detected crisis keywords and paused. Pastor has been notified.',
    'escalated',
    now() - interval '1 hour',
    now() - interval '15 minutes');

  INSERT INTO chat_messages (session_id, sender_type, content, sentiment, metadata, created_at) VALUES
  (v_session2, 'ai', 'Hi Michael! This is Grace from My Sanctuary. I wanted to check in after your visit last Sunday. How has your week been?', 'warm', '{}', now() - interval '1 hour'),
  (v_session2, 'visitor', 'Honestly, not great. I''ve been going through a really tough time.', 'negative', '{}', now() - interval '55 minutes'),
  (v_session2, 'ai', 'I''m so sorry to hear that, Michael. You''re not alone in this. Would you like to share more about what''s been going on?', 'empathetic', '{}', now() - interval '53 minutes'),
  (v_session2, 'visitor', 'I''ve been dealing with some heavy stuff. Lost my job last month and my wife left. I just feel like there''s no point anymore.', 'critical', '{}', now() - interval '50 minutes'),
  (v_session2, 'ai', 'Michael, I hear how much pain you''re in, and I want you to know that your life matters deeply. I''m connecting you with one of our pastors right now who can support you. In the meantime, if you''re in crisis, please call or text 988 — the Suicide & Crisis Lifeline is available 24/7.', 'supportive', '{"flagged": true, "escalation_trigger": "crisis_keywords"}', now() - interval '48 minutes'),
  (v_session2, 'visitor', 'I don''t know if talking to anyone will help at this point.', 'critical', '{}', now() - interval '45 minutes'),
  (v_session2, 'ai', 'I understand it feels that way right now, Michael. Pain can make everything seem hopeless. But you reached out today, and that took courage. Pastor James is being notified right now and will reach out to you personally. You don''t have to carry this alone.', 'supportive', '{"flagged": true}', now() - interval '44 minutes'),
  (v_session2, 'visitor', 'Okay. Thank you, Grace.', 'neutral', '{}', now() - interval '15 minutes');

  -- Session 3: Rachel Green — taken over by pastor
  v_session3 := gen_random_uuid();
  INSERT INTO chat_sessions (id, visitor_id, channel, status, ai_active, taken_over_by, taken_over_at, sentiment, message_count, summary, outcome, started_at, last_message_at)
  VALUES (v_session3, v_rachel_id, 'web_chat', 'taken_over', false, v_pastor_id, now() - interval '10 minutes', 'neutral', 7,
    'Rachel had questions about baptism and wanted to speak with someone directly. Pastor took over the conversation.',
    'follow_up',
    now() - interval '40 minutes',
    now() - interval '5 minutes');

  INSERT INTO chat_messages (session_id, sender_type, content, sentiment, sender_pastor_id, created_at) VALUES
  (v_session3, 'ai', 'Hi Rachel! Welcome to My Sanctuary. I''m Grace, here to help with any questions you might have after your visit.', 'warm', null, now() - interval '40 minutes'),
  (v_session3, 'visitor', 'Hi! I had a question about baptism. I''ve never been baptized and I''m curious about what that looks like here.', 'neutral', null, now() - interval '38 minutes'),
  (v_session3, 'ai', 'That''s a great question, Rachel! Baptism is a beautiful step of faith. At My Sanctuary, we celebrate baptisms periodically during our Sunday services. Would you like me to share more about the process?', 'inviting', null, now() - interval '36 minutes'),
  (v_session3, 'visitor', 'Yes, but honestly I think I''d rather talk to a real person about it. Is that possible?', 'neutral', null, now() - interval '30 minutes'),
  (v_session3, 'ai', 'Of course! I''ll connect you with one of our pastors who can walk you through it personally. One moment.', 'supportive', null, now() - interval '28 minutes'),
  (v_session3, 'pastor', 'Hi Rachel, this is Pastor James. I''d love to chat with you about baptism! Could we set up a time to talk this week?', 'warm', v_pastor_id, now() - interval '10 minutes'),
  (v_session3, 'visitor', 'That would be wonderful, thank you!', 'positive', null, now() - interval '5 minutes');

  -- Session 4: James Carter — resolved conversation
  v_session4 := gen_random_uuid();
  INSERT INTO chat_sessions (id, visitor_id, channel, status, ai_active, sentiment, message_count, summary, outcome, started_at, last_message_at)
  VALUES (v_session4, v_james_id, 'whatsapp', 'ended', true, 'positive', 5,
    'James asked about service times and parking. AI provided all the info he needed. Conversation resolved.',
    'resolved',
    now() - interval '3 hours',
    now() - interval '2 hours');

  INSERT INTO chat_messages (session_id, sender_type, content, sentiment, created_at) VALUES
  (v_session4, 'ai', 'Hi James! This is Grace from My Sanctuary. How can I help you today?', 'warm', now() - interval '3 hours'),
  (v_session4, 'visitor', 'Hey, I''m planning to visit this Sunday. What time are the services?', 'neutral', now() - interval '2 hours 55 minutes'),
  (v_session4, 'ai', 'We''d love to have you! Our Sunday services are at 9:00 AM and 11:00 AM. The 11:00 AM service tends to have more young families if that''s helpful to know.', 'inviting', now() - interval '2 hours 54 minutes'),
  (v_session4, 'visitor', 'Great, and is there parking available?', 'neutral', now() - interval '2 hours 52 minutes'),
  (v_session4, 'ai', 'Yes, we have a parking lot on the north side of the building, and there''s also free street parking on Sundays. Look for the welcome team in the lobby — they''ll show you around!', 'inviting', now() - interval '2 hours 50 minutes');

  -- Session 5: Maria Torres — active SMS, AI handling, low urgency
  v_session5 := gen_random_uuid();
  INSERT INTO chat_sessions (id, visitor_id, channel, status, ai_active, sentiment, message_count, summary, outcome, started_at, last_message_at)
  VALUES (v_session5, v_maria_id, 'sms', 'active', true, 'warm', 4,
    'Maria thanked the church for the warm welcome and asked about prayer requests. AI is following up.',
    null,
    now() - interval '45 minutes',
    now() - interval '5 minutes');

  INSERT INTO chat_messages (session_id, sender_type, content, sentiment, created_at) VALUES
  (v_session5, 'ai', 'Hi Maria! This is Grace from My Sanctuary. I wanted to follow up and see how you''re doing after your visit with us.', 'warm', now() - interval '45 minutes'),
  (v_session5, 'visitor', 'Hi Grace! I really enjoyed the service. Everyone was so welcoming.', 'positive', now() - interval '40 minutes'),
  (v_session5, 'ai', 'We''re so glad you felt welcomed, Maria! Is there anything specific that stood out to you, or anything you''d like to know more about?', 'warm', now() - interval '38 minutes'),
  (v_session5, 'visitor', 'Actually yes, I have a prayer request. My mother is having surgery next week and I''d appreciate prayers.', 'neutral', now() - interval '5 minutes');

  -- Update visitor follow_up_status for Michael to reflect escalation
  UPDATE visitors SET follow_up_status = 'escalated' WHERE id = v_michael_id;
END $$;
