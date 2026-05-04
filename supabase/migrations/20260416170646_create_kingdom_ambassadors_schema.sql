
/*
  # Kingdom Ambassadors - Core Database Schema

  ## Overview
  This migration creates the complete data model for the Kingdom Ambassadors
  church visitor engagement platform. It tracks visitors from first visit through
  full integration into church community.

  ## New Tables

  ### 1. pastors
  - Staff and pastoral team members
  - Columns: id, name, role, email, phone, avatar_url, created_at

  ### 2. visitors
  - Core visitor profiles with full contact and engagement data
  - Columns: id, first_name, last_name, email, phone, avatar_url,
    preferred_channel, visit_date, service_attended, family_details,
    segmentation_tags, consent_state, follow_up_status, assigned_pastor_id,
    ai_memory, notes, created_at, updated_at

  ### 3. visit_events
  - Tracks each service attendance for a visitor
  - Columns: id, visitor_id, service_date, service_name, notes, created_at

  ### 4. communication_events
  - Every touchpoint sent to or received from a visitor
  - Columns: id, visitor_id, channel, direction, content, status,
    sentiment, created_at

  ### 5. concerns
  - Negative sentiment concerns raised by visitors
  - Columns: id, visitor_id, trigger_message, summary, summary_confirmed,
    summary_version, urgency_level, concern_status, pastor_delivery_status,
    coffee_invite_status, created_at, updated_at

  ### 6. concern_revisions
  - Versioned AI summaries during the active listening loop
  - Columns: id, concern_id, version, summary_text, confirmed_by_visitor, created_at

  ### 7. escalations
  - Formal pastor notifications for confirmed concerns
  - Columns: id, concern_id, visitor_id, assigned_pastor_id, briefing_packet,
    urgency_level, status, created_at, updated_at

  ### 8. meeting_invitations
  - Coffee/gathering scheduling invitations
  - Columns: id, visitor_id, concern_id, pastor_id, proposed_times,
    selected_time, status, location, notes, created_at, updated_at

  ### 9. follow_up_sequences
  - Tracks each visitor's position in the 6-week follow-up workflow
  - Columns: id, visitor_id, current_state, sequence_week, last_touch_at,
    next_touch_at, branch_conditions, created_at, updated_at

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read all data within their scope
  - All write operations require authentication
*/

-- ============================================================
-- PASTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS pastors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT 'pastor',
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pastors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read pastors"
  ON pastors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pastors"
  ON pastors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update pastors"
  ON pastors FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- VISITORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  avatar_url text,
  preferred_channel text DEFAULT 'text',
  visit_date date,
  service_attended text,
  family_details jsonb DEFAULT '{}',
  segmentation_tags text[] DEFAULT '{}',
  consent_state boolean DEFAULT true,
  follow_up_status text DEFAULT 'new_visitor',
  assigned_pastor_id uuid REFERENCES pastors(id),
  ai_memory jsonb DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read visitors"
  ON visitors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert visitors"
  ON visitors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update visitors"
  ON visitors FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- VISIT EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS visit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  service_date date NOT NULL,
  service_name text DEFAULT 'Sunday Service',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read visit_events"
  ON visit_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert visit_events"
  ON visit_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update visit_events"
  ON visit_events FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- COMMUNICATION EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS communication_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'text',
  direction text NOT NULL DEFAULT 'outbound',
  content text,
  status text DEFAULT 'sent',
  sentiment text DEFAULT 'neutral',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE communication_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read communication_events"
  ON communication_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert communication_events"
  ON communication_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update communication_events"
  ON communication_events FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- CONCERNS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS concerns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  trigger_message text,
  summary text,
  summary_confirmed boolean DEFAULT false,
  summary_version integer DEFAULT 1,
  urgency_level text DEFAULT 'medium',
  concern_status text DEFAULT 'raised',
  pastor_delivery_status text DEFAULT 'pending',
  coffee_invite_status text DEFAULT 'not_sent',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE concerns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read concerns"
  ON concerns FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert concerns"
  ON concerns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update concerns"
  ON concerns FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- CONCERN REVISIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS concern_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concern_id uuid NOT NULL REFERENCES concerns(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  summary_text text NOT NULL,
  confirmed_by_visitor boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE concern_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read concern_revisions"
  ON concern_revisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert concern_revisions"
  ON concern_revisions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- ESCALATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concern_id uuid NOT NULL REFERENCES concerns(id) ON DELETE CASCADE,
  visitor_id uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  assigned_pastor_id uuid REFERENCES pastors(id),
  briefing_packet jsonb DEFAULT '{}',
  urgency_level text DEFAULT 'medium',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read escalations"
  ON escalations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert escalations"
  ON escalations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update escalations"
  ON escalations FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- MEETING INVITATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  concern_id uuid REFERENCES concerns(id),
  pastor_id uuid REFERENCES pastors(id),
  proposed_times jsonb DEFAULT '[]',
  selected_time timestamptz,
  status text DEFAULT 'pending',
  location text DEFAULT 'Church Coffee Corner',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meeting_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read meeting_invitations"
  ON meeting_invitations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meeting_invitations"
  ON meeting_invitations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update meeting_invitations"
  ON meeting_invitations FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- FOLLOW UP SEQUENCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS follow_up_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  current_state text DEFAULT 'new_visitor',
  sequence_week integer DEFAULT 0,
  last_touch_at timestamptz,
  next_touch_at timestamptz,
  branch_conditions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE follow_up_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read follow_up_sequences"
  ON follow_up_sequences FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert follow_up_sequences"
  ON follow_up_sequences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update follow_up_sequences"
  ON follow_up_sequences FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
