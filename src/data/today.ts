export interface TodayTask {
  id: string;
  guestName: string;
  guestInitials: string;
  avatarColor: string;
  title: string;
  detail: string;
  time: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'escalation' | 'approval' | 'follow-up' | 'risk' | 'returning' | 'prep' | 'done';
  channel?: string;
  draftMessage?: string;
  quote?: string;
  summary?: string;
  factChips?: string[];
  whyText?: string;
  visitDate?: string;
  serviceName?: string;
  meta?: string;
}

export interface TodayLeader {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  status: 'replied' | 'needs-followup' | 'returning' | 'at-risk';
  lastMessage: string;
  time: string;
  detail: string;
}

export interface Escalation {
  id: string;
  guestName: string;
  guestInitials: string;
  avatarColor: string;
  reason: string;
  openedAt: string;
  channel: string;
  quote?: string;
  summary?: string;
  factChips?: string[];
  whyText?: string;
  visitDate?: string;
  serviceName?: string;
}

export interface PilotHealthItem {
  label: string;
  target: string;
  current: string;
  onTrack: boolean;
}

export interface AgentActivityItem {
  time: string;
  action: string;
  detail: string;
  channel: string;
}

export const escalations: Escalation[] = [
  {
    id: 'esc1',
    guestName: 'Sarah Johnson',
    guestInitials: 'SJ',
    avatarColor: 'from-rose-400 to-rose-600',
    reason: 'Shared a concern about feeling unseen. Needs a pastor to reply.',
    openedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    channel: 'SMS',
    quote: "I don't think anyone really noticed I was there.",
    summary: "Sarah's message matched your escalation topic 'Medical or grief / emotional concern'. The assistant paused and is waiting for a staff member.",
    factChips: ['First visit', 'Interested in women\'s ministry', 'Requested prayer'],
    whyText: "Sarah's message matched your escalation topic 'Medical or grief / emotional concern'. The assistant paused and is waiting for a staff member.",
    visitDate: 'Sep 27',
    serviceName: '11:00 AM service',
  },
];

export const todayTasks: TodayTask[] = [
  {
    id: 't2',
    guestName: 'James Carter',
    guestInitials: 'JC',
    avatarColor: 'from-blue-400 to-blue-600',
    title: 'James Carter',
    detail: 'Asked about kids ministry — AI drafted a warm response',
    time: '14:15',
    priority: 'high',
    status: 'approval',
    channel: 'SMS',
    draftMessage: 'Hi James! Thanks for visiting Grace Community Church this morning. Yes, we have a kids program for ages 0-5 during both services. Your 4-year-old is welcome anytime! Feel free to ask me anything else. Reply STOP to opt out.',
    quote: 'Do you have a kids program for my 4-year-old?',
    summary: 'James replied to the welcome text with a question about kids ministry. The assistant drafted a response for your review.',
    factChips: ['First visit', '2 children', 'Interested in kids ministry'],
    meta: 'Replied to welcome message · 2 children',
  },
  {
    id: 't3',
    guestName: 'Maria Torres',
    guestInitials: 'MT',
    avatarColor: 'from-amber-400 to-amber-600',
    title: 'Maria Torres',
    detail: 'No reply to first text in 3 days. Suggested: a personal call from a staff member.',
    time: '13:00',
    priority: 'high',
    status: 'follow-up',
    channel: 'SMS',
    quote: 'Thanks! I got the welcome text.',
    summary: 'Maria received the welcome text but has not replied to the follow-up in 3 days. A personal call is recommended.',
    factChips: ['First visit', 'Sep 20'],
    meta: 'No reply to follow-up · 3 days',
  },
  {
    id: 't4',
    guestName: 'Michael Bennett',
    guestInitials: 'MB',
    avatarColor: 'from-stone-400 to-stone-600',
    title: 'Michael Bennett',
    detail: 'No response in 5 days. Attended 2nd service, sent 2 texts, no reply.',
    time: '12:00',
    priority: 'medium',
    status: 'risk',
    channel: 'SMS',
    quote: 'Maybe next week.',
    summary: 'Michael has not responded to two texts in 5 days. He may need a phone call.',
    factChips: ['First visit', 'Sep 22', '11:00 AM service'],
    meta: 'No response in 5 days · 2 texts sent',
  },
  {
    id: 't5',
    guestName: 'Rachel Green',
    guestInitials: 'RG',
    avatarColor: 'from-emerald-400 to-emerald-600',
    title: 'Rachel Green',
    detail: 'Confirmed she will be at the 11:00 service. Prep a welcome.',
    time: '11:30',
    priority: 'medium',
    status: 'returning',
    channel: 'SMS',
    quote: "Yes! I'll be there Sunday at 11.",
    summary: 'Rachel confirmed she is coming back this Sunday for the 11:00 service. Prepare a warm welcome.',
    factChips: ['Returning guest', '2nd visit', '11:00 AM service'],
    meta: 'Confirmed for Sunday · 11:00 AM',
  },
  {
    id: 't6',
    guestName: 'Connection Cards',
    guestInitials: 'CC',
    avatarColor: 'from-stone-400 to-stone-600',
    title: '2 connection cards from the 11:00 service are missing a phone number',
    detail: 'Add a phone number or switch these guests to email-first follow-up.',
    time: '09:00',
    priority: 'low',
    status: 'prep',
    meta: '2 cards missing phone · 11:00 service',
  },
  {
    id: 't7',
    guestName: 'James Carter',
    guestInitials: 'JC',
    avatarColor: 'from-blue-400 to-blue-600',
    title: 'James Carter',
    detail: 'Welcomed and asked about prayer requests.',
    time: '08:15',
    priority: 'low',
    status: 'done',
    channel: 'SMS',
  },
];

export const todayLeaders: TodayLeader[] = [
  { id: 'l1', name: 'Sarah Johnson', initials: 'SJ', avatarColor: 'from-rose-400 to-rose-600', status: 'at-risk', lastMessage: "I don't think anyone really noticed I was there...", time: '14:32', detail: 'Escalated · needs pastor' },
  { id: 'l2', name: 'James Carter', initials: 'JC', avatarColor: 'from-blue-400 to-blue-600', status: 'needs-followup', lastMessage: 'Do you have a kids program for my 4-year-old?', time: '14:15', detail: 'Draft reply ready' },
  { id: 'l3', name: 'Maria Torres', initials: 'MT', avatarColor: 'from-amber-400 to-amber-600', status: 'needs-followup', lastMessage: 'Thanks! I got the welcome text.', time: '3 days ago', detail: 'No reply to follow-up' },
  { id: 'l4', name: 'Rachel Green', initials: 'RG', avatarColor: 'from-emerald-400 to-emerald-600', status: 'returning', lastMessage: "Yes! I'll be there Sunday at 11.", time: '11:30', detail: 'Confirmed for Sunday' },
  { id: 'l5', name: 'Michael Bennett', initials: 'MB', avatarColor: 'from-stone-400 to-stone-600', status: 'at-risk', lastMessage: 'Maybe next week.', time: '5 days ago', detail: 'No response in 5 days' },
];

export const pilotHealth: PilotHealthItem[] = [
  { label: 'First text ≤ 30 min after service end', target: '≥ 95%', current: '96%', onTrack: 96 >= 95 },
  { label: 'Guest reply rate', target: '≥ 30%', current: '34%', onTrack: 34 >= 30 },
  { label: 'Median time to human on escalations', target: '≤ 15 min', current: '8 min', onTrack: 8 <= 15 },
  { label: 'STOP honored', target: '100%', current: '100%', onTrack: 100 >= 100 },
  { label: 'Sundays leader list used', target: '6 of 6', current: '3 of 6', onTrack: 3 >= 6 },
];

export const agentActivity: AgentActivityItem[] = [
  { time: '14:32', action: 'Escalation triggered', detail: 'Sarah Johnson — concern about feeling unseen', channel: 'SMS' },
  { time: '14:30', action: 'Draft created', detail: 'James Carter — kids ministry reply', channel: 'SMS' },
  { time: '14:15', action: 'Message sent', detail: 'Maria Torres — follow-up email', channel: 'Email' },
  { time: '13:00', action: 'Quiet hours checked', detail: 'No texts scheduled 9 PM – 8 AM guest time', channel: 'System' },
  { time: '11:30', action: 'Reminder set', detail: 'Rachel Green — Sunday welcome prep', channel: 'SMS' },
  { time: '08:15', action: 'First text sent', detail: 'James Carter — welcome message', channel: 'SMS' },
];
