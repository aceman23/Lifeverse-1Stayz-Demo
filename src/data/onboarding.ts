export interface ChurchProfile {
  name: string;
  website: string;
  address: string;
  timezone: string;
  phone: string;
  yourName: string;
  yourRole: string;
}

export interface ServiceRow {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  reviewed: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  mobile: string;
  email: string;
  receivesEscalations: boolean;
  receivesCare: boolean;
  receivesGeneral: boolean;
}

export interface DoctrinalPosition {
  id: string;
  topic: string;
  stance: 'explain' | 'route' | 'skip';
  wording: string;
}

export interface EscalationTopic {
  id: string;
  label: string;
  enabled: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  body: string;
}

export type FirstMessageStatus = 'draft' | 'awaiting' | 'approved';
export type SmsStatus = 'submitted' | 'pending' | 'approved';

export interface OnboardingState {
  currentStep: number;
  completed: boolean;

  church: ChurchProfile;
  serviceSchedule: ServiceRow[];
  ministries: string[];
  guestFields: string[];

  needs: string[];
  otherNeed: string;

  integrations: {
    subsplash: 'none' | 'webhook' | 'zapier' | 'qrcard';
    email: 'none' | 'gmail' | 'outlook' | 'yahoo' | 'proton' | 'icloud' | 'zoho' | '1stayz' | 'other';
    smsStatus: SmsStatus;
  emailFallbackAcknowledged: boolean;
  shadowSundayCompleted: boolean;
    consentWordingLive: boolean;
  shadowSundayAcknowledged: boolean;
  };

  documents: { id: string; name: string; type: string }[];
  doctrinalPositions: DoctrinalPosition[];
  escalationTopics: EscalationTopic[];
  tone: string[];
  signOff: string;

  guardrailsApprovedBy: string | null;
  guardrailsApprovedAt: string | null;

  firstMessageStatus: FirstMessageStatus;
  firstMessageApprovedBy: string | null;
  firstMessageApprovedAt: string | null;

  staff: StaffMember[];
  escalationOrder: string[];
  quietHoursStart: string;
  quietHoursEnd: string;
  staffAlertsEnabled: boolean;
  staffAlertsPhone: string;
  staffAlertsConsent: boolean;

  selectedTemplate: string;
  templates: MessageTemplate[];

  mode: 'shadow' | 'live' | null;
  readyCheck: Record<string, 'green' | 'amber' | 'gray'>;
}

export const STEP_LABELS = [
  'Your Church',
  'Reading Your Site',
  'What You Need',
  'Connect Systems',
  'Guardrails',
  'Team & Escalations',
  'First Message',
  'Ready Check',
];

export const COACH_CONTENT: Record<number, string> = {
  0: "Tell us about your church so 1Stayz can personalize every conversation. We use your website to pre-fill service times, ministries, and beliefs — you'll review everything before it goes live.",
  1: "We read your website to save you time. Everything we found is a draft — you review and approve each card. The service schedule matters most: your first text goes out within 30 minutes after the service a guest attended ends.",
  2: "Choose what you want 1Stayz to handle during the pilot. We'll focus on the essentials first — following up with every guest and alerting you when someone needs a pastor.",
  3: "Subsplash stays your system of record — 1Stayz only runs follow-up. Until your text number is approved by the carrier, we'll reach out by email first.",
  4: "This is the most important step. If your church holds a specific view on baptism and a guest asks about it, your agent needs to know whether to explain it or hand it to a pastor. These guardrails keep the assistant aligned with your church's beliefs.",
  5: "When someone needs a pastor, 1Stayz needs to know who to contact and in what order. Quiet hours protect your guests from late-night messages in their local time zone.",
  6: "Your first message sets the tone for every conversation. Pick a template, make it yours, and send it to your pastor for approval. The preview shows exactly what a guest will see.",
  7: "Almost there! Shadow mode means 1Stayz writes every message but holds it for your approval before sending. Go live when you're ready — we'll check that everything is in place.",
};

export const DEFAULT_MINISTRIES = [
  'Kids Ministry',
  'Youth Group',
  'Small Groups',
  'Newcomer Lunch',
  'Recovery Ministry',
  "Men's Breakfast",
  "Women's Bible Study",
  'Worship Team',
  'Missions & Outreach',
  'Young Adults',
];

export const DEFAULT_GUEST_FIELDS = [
  'first_name',
  'last_name',
  'phone',
  'email',
  'household_size',
  'kids_ages',
  'how_they_heard',
  'prayer_request',
  'which_service',
];

export const DEFAULT_DOCTRINAL_TOPICS = [
  'Baptism',
  'Communion',
  'Salvation',
  'Spiritual gifts',
  'End times',
  'Marriage',
  'Women in leadership',
  'Church governance',
  'Membership',
];

export const DEFAULT_ESCALATION_TOPICS = [
  'Crisis or self-harm',
  'Medical or grief',
  'Counseling requests',
  'Marriage & family conflict',
  'Money or benevolence',
  'Complaints',
  'Wants to meet a pastor',
  'Theology questions not covered above',
  'Anyone under 18',
];

export const TIMEZONES = [
  'America/New_York (ET)',
  'America/Chicago (CT)',
  'America/Denver (MT)',
  'America/Los_Angeles (PT)',
  'America/Anchorage (AKT)',
  'Pacific/Honolulu (HST)',
];

export const TONE_OPTIONS = ['Warm', 'Casual', 'Formal', 'Joyful', 'Pastoral'];

export const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'warm',
    name: 'Warm welcome',
    body: "Hi {first_name}! Thanks so much for joining us at {church_name} this morning. I'm the team's digital assistant. What would you like to know about the church or our {kids_ministry}? You can keep texting me here anytime. Reply STOP to opt out.",
  },
  {
    id: 'short',
    name: 'Short & simple',
    body: "Hi {first_name}! So glad you visited {church_name} today. I'm here if you have any questions — just reply to this text. Reply STOP to opt out.",
  },
  {
    id: 'family',
    name: 'Family-focused',
    body: "Hi {first_name}! It was great having your family at {church_name} this morning. I'd love to help you find your way around — anything you'd like to know about kids' programs or small groups? Just text me back. Reply STOP to opt out.",
  },
];

export const ROLE_OPTIONS = [
  'Senior Pastor',
  'Executive Pastor',
  'Assimilation Director',
  'Church Admin',
  'Other',
];

export const NEEDS_LIVE = [
  { emoji: '💬', label: 'Follow up with every first-time guest' },
  { emoji: '📋', label: 'Know who needs a call this week' },
  { emoji: '🚨', label: 'Get alerted when someone needs a pastor' },
  { emoji: '⛪', label: 'Prepare for Sunday' },
];

export const NEEDS_SOON = [
  { emoji: '🤝', label: 'Coordinate volunteers' },
  { emoji: '📅', label: 'Schedule coffee & meetings' },
  { emoji: '🎁', label: 'Send welcome gifts' },
  { emoji: '🎥', label: 'Personal video welcome' },
];

export const LOCKED_RULES = [
  'One question per message',
  'Short texts (max 2 SMS)',
  'Always says it\'s an assistant',
  'Honors STOP instantly',
];

export const CONSENT_WORDING = "By sharing your mobile number, you agree to receive text messages from {church_name}, sent by 1Stayz on the church's behalf, about your visit and next steps. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help.";

export function createInitialState(): OnboardingState {
  return {
    currentStep: 0,
    completed: false,
    church: {
      name: '',
      website: '',
      address: '',
      timezone: 'America/Chicago (CT)',
      phone: '',
      yourName: '',
      yourRole: '',
    },
    serviceSchedule: [],
    ministries: [...DEFAULT_MINISTRIES.slice(0, 6)],
    guestFields: [...DEFAULT_GUEST_FIELDS],
    needs: [],
    otherNeed: '',
    integrations: {
      subsplash: 'none',
      email: 'none',
      smsStatus: 'submitted',
      emailFallbackAcknowledged: false,
      shadowSundayCompleted: false,
      consentWordingLive: false,
      shadowSundayAcknowledged: false,
    },
    documents: [],
    doctrinalPositions: DEFAULT_DOCTRINAL_TOPICS.map((topic, i) => ({
      id: `pos-${i}`,
      topic,
      stance: 'route' as const,
      wording: '',
    })),
    escalationTopics: DEFAULT_ESCALATION_TOPICS.map((label, i) => ({
      id: `esc-${i}`,
      label,
      enabled: true,
    })),
    tone: ['Warm'],
    signOff: 'The team at Grace Community Church',
    guardrailsApprovedBy: null,
    guardrailsApprovedAt: null,
    firstMessageStatus: 'draft',
    firstMessageApprovedBy: null,
    firstMessageApprovedAt: null,
    staff: [
      { id: 's1', name: 'Pastor Ray', role: 'Senior Pastor', mobile: '(555) 123-4567', email: 'ray@grace.org', receivesEscalations: true, receivesCare: true, receivesGeneral: true },
      { id: 's2', name: 'Sarah Chen', role: 'Assimilation Director', mobile: '(555) 234-5678', email: 'sarah@grace.org', receivesEscalations: false, receivesCare: true, receivesGeneral: true },
      { id: 's3', name: 'Mike Johnson', role: 'Care Pastor', mobile: '(555) 345-6789', email: 'mike@grace.org', receivesEscalations: true, receivesCare: true, receivesGeneral: false },
    ],
    escalationOrder: ['s1', 's3', 's2'],
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
    staffAlertsEnabled: true,
    staffAlertsPhone: '(555) 123-4567',
    staffAlertsConsent: false,
    selectedTemplate: 'warm',
    templates: DEFAULT_TEMPLATES,
    mode: null,
    readyCheck: {},
  };
}

export function createDemoState(): OnboardingState {
  const base = createInitialState();
  return {
    ...base,
    currentStep: 7,
    completed: true,
    church: {
      name: 'Grace Community Church',
      website: 'gracecommunity.org',
      address: '123 Main St, Springfield, IL 62701',
      timezone: 'America/Chicago (CT)',
      phone: '(555) 123-4567',
      yourName: 'Pastor Ray',
      yourRole: 'Senior Pastor',
    },
    serviceSchedule: [
      { id: 'svc-1', name: 'Sunday Morning First Service', day: 'Sunday', startTime: '09:00', endTime: '10:15', reviewed: true },
      { id: 'svc-2', name: 'Sunday Morning Second Service', day: 'Sunday', startTime: '11:00', endTime: '12:15', reviewed: true },
    ],
    needs: ['Follow up with every first-time guest', 'Get alerted when someone needs a pastor'],
    integrations: {
      ...base.integrations,
      subsplash: 'qrcard',
      email: '1stayz',
      smsStatus: 'approved',
      consentWordingLive: true,
    },
    guardrailsApprovedBy: 'Pastor Ray',
    guardrailsApprovedAt: new Date().toISOString(),
    firstMessageStatus: 'approved',
    firstMessageApprovedBy: 'Pastor Ray',
    firstMessageApprovedAt: new Date().toISOString(),
    staffAlertsConsent: true,
    mode: 'shadow',
  };
}
