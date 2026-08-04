export interface Pastor {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Visitor {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  preferred_channel: string;
  visit_date: string | null;
  service_attended: string | null;
  family_details: Record<string, unknown>;
  segmentation_tags: string[];
  consent_state: boolean;
  follow_up_status: FollowUpStatus;
  assigned_pastor_id: string | null;
  ai_memory: Record<string, unknown>;
  notes: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  pastor?: Pastor;
}

export type FollowUpStatus =
  | 'new_visitor'
  | 'thanked'
  | 'contacted'
  | 'engaged'
  | 'concern_raised'
  | 'concern_confirmed'
  | 'escalated'
  | 'invited'
  | 'scheduled'
  | 'returned'
  | 'integrated';

export interface VisitEvent {
  id: string;
  visitor_id: string;
  service_date: string;
  service_name: string;
  notes: string | null;
  created_at: string;
}

export interface CommunicationEvent {
  id: string;
  visitor_id: string;
  channel: string;
  direction: 'inbound' | 'outbound';
  content: string | null;
  status: string;
  sentiment: string;
  created_at: string;
}

export interface Concern {
  id: string;
  visitor_id: string;
  trigger_message: string | null;
  summary: string | null;
  summary_confirmed: boolean;
  summary_version: number;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  concern_status: ConcernStatus;
  pastor_delivery_status: string;
  coffee_invite_status: string;
  created_at: string;
  updated_at: string;
}

export type ConcernStatus =
  | 'raised'
  | 'confirmed'
  | 'escalated'
  | 'invited'
  | 'scheduled'
  | 'resolved';

export interface ConcernRevision {
  id: string;
  concern_id: string;
  version: number;
  summary_text: string;
  confirmed_by_visitor: boolean;
  created_at: string;
}

export interface Escalation {
  id: string;
  concern_id: string;
  visitor_id: string;
  assigned_pastor_id: string | null;
  briefing_packet: Record<string, unknown>;
  urgency_level: string;
  status: string;
  created_at: string;
  updated_at: string;
  pastor?: Pastor;
}

export interface ProposedTime {
  day: string;
  time: string;
  datetime: string;
}

export interface MeetingInvitation {
  id: string;
  visitor_id: string;
  concern_id: string | null;
  pastor_id: string | null;
  proposed_times: ProposedTime[];
  selected_time: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  location: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  pastor?: Pastor;
}

export interface FollowUpSequence {
  id: string;
  visitor_id: string;
  current_state: string;
  sequence_week: number;
  last_touch_at: string | null;
  next_touch_at: string | null;
  branch_conditions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  newVisitorsThisWeek: number;
  inConversation: number;
  concernsRaised: number;
}

export type ChatSessionStatus = 'active' | 'paused' | 'ended' | 'taken_over';

export type ChatChannel = 'web_chat' | 'sms' | 'whatsapp' | 'email';

export type ChatOutcome = 'resolved' | 'escalated' | 'no_action' | 'follow_up';

export interface ChatSession {
  id: string;
  visitor_id: string;
  channel: ChatChannel;
  status: ChatSessionStatus;
  ai_active: boolean;
  taken_over_by: string | null;
  taken_over_at: string | null;
  summary: string | null;
  outcome: ChatOutcome | null;
  sentiment: string;
  message_count: number;
  started_at: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  visitor?: Visitor;
  pastor?: Pastor | null;
}

export type ChatSenderType = 'visitor' | 'ai' | 'pastor';

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: ChatSenderType;
  sender_pastor_id: string | null;
  content: string;
  sentiment: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface VisitorWithDetails extends Visitor {
  concerns?: Concern[];
  communication_events?: CommunicationEvent[];
  visit_events?: VisitEvent[];
  follow_up_sequences?: FollowUpSequence[];
  meeting_invitations?: MeetingInvitation[];
  chat_sessions?: ChatSession[];
}
