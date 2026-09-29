export interface TodayTask {
  id: string;
  guestName: string;
  guestInitials: string;
  avatarColor: string;
  title: string;
  detail: string;
  time: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'approval' | 'follow-up' | 'risk' | 'returning' | 'prep' | 'done';
  channel?: string;
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

export const todayTasks: TodayTask[] = [
  { id: 't1', guestName: 'Sarah Johnson', guestInitials: 'SJ', avatarColor: 'from-rose-400 to-rose-600', title: 'Escalation: shared concern about feeling unseen', detail: 'Needs a pastor within 15 min · AI paused conversation', time: '14:32', priority: 'urgent', status: 'approval', channel: 'SMS' },
  { id: 't2', guestName: 'James Carter', guestInitials: 'JC', avatarColor: 'from-blue-400 to-blue-600', title: 'Draft reply ready for your review', detail: 'Asked about kids ministry — AI drafted a warm response', time: '14:15', priority: 'high', status: 'approval', channel: 'SMS' },
  { id: 't3', guestName: 'Maria Torres', guestInitials: 'MT', avatarColor: 'from-amber-400 to-amber-600', title: 'Follow up today — visited 3 days ago', detail: 'No response to first text. Try a different channel.', time: '13:00', priority: 'high', status: 'follow-up', channel: 'Email' },
  { id: 't4', guestName: 'Michael Bennett', guestInitials: 'MB', avatarColor: 'from-stone-400 to-stone-600', title: 'At risk — no response in 5 days', detail: 'Attended 2nd service. Sent 2 texts, no reply.', time: '12:00', priority: 'medium', status: 'risk', channel: 'SMS' },
  { id: 't5', guestName: 'Rachel Green', guestInitials: 'RG', avatarColor: 'from-emerald-400 to-emerald-600', title: 'Coming back this Sunday — confirmed', detail: 'Said she will be at 11:00 service. Prep a welcome.', time: '11:30', priority: 'medium', status: 'returning', channel: 'SMS' },
  { id: 't6', guestName: 'Sarah Johnson', guestInitials: 'SJ', avatarColor: 'from-rose-400 to-rose-600', title: 'Sunday prep: coffee invite accepted', detail: 'Coffee with Pastor Ray Thursday 10 AM confirmed.', time: '09:00', priority: 'low', status: 'prep', channel: 'SMS' },
  { id: 't7', guestName: 'James Carter', guestInitials: 'JC', avatarColor: 'from-blue-400 to-blue-600', title: 'Done — first text sent', detail: 'Welcomed and asked about prayer requests.', time: '08:15', priority: 'low', status: 'done', channel: 'SMS' },
];

export const todayLeaders: TodayLeader[] = [
  { id: 'l1', name: 'Sarah Johnson', initials: 'SJ', avatarColor: 'from-rose-400 to-rose-600', status: 'at-risk', lastMessage: "I don't think anyone really noticed I was there...", time: '14:32', detail: 'Escalated · needs pastor' },
  { id: 'l2', name: 'James Carter', initials: 'JC', avatarColor: 'from-blue-400 to-blue-600', status: 'needs-followup', lastMessage: 'Do you have a kids program for my 4-year-old?', time: '14:15', detail: 'Draft reply ready' },
  { id: 'l3', name: 'Maria Torres', initials: 'MT', avatarColor: 'from-amber-400 to-amber-600', status: 'needs-followup', lastMessage: 'Thanks! I got the email.', time: '13:00', detail: 'No reply to follow-up' },
  { id: 'l4', name: 'Rachel Green', initials: 'RG', avatarColor: 'from-emerald-400 to-emerald-600', status: 'returning', lastMessage: "Yes! I'll be there Sunday at 11.", time: '11:30', detail: 'Confirmed for Sunday' },
  { id: 'l5', name: 'Michael Bennett', initials: 'MB', avatarColor: 'from-stone-400 to-stone-600', status: 'at-risk', lastMessage: 'Maybe next week.', time: '5 days ago', detail: 'No response in 5 days' },
];

export const pilotHealth: PilotHealthItem[] = [
  { label: 'First-contact rate', target: '100% within 30 min', current: '94%', onTrack: true },
  { label: 'Escalation response', target: '< 15 min', current: '8 min avg', onTrack: true },
  { label: 'Guests engaged', target: '12 / week', current: '9 / week', onTrack: false },
  { label: 'Shadow approvals', target: '0 pending > 24h', current: '2 pending', onTrack: false },
];

export const agentActivity: AgentActivityItem[] = [
  { time: '14:32', action: 'Escalation triggered', detail: 'Sarah Johnson — concern about feeling unseen', channel: 'SMS' },
  { time: '14:30', action: 'Draft created', detail: 'James Carter — kids ministry reply', channel: 'SMS' },
  { time: '14:15', action: 'Message sent', detail: 'Maria Torres — follow-up email', channel: 'Email' },
  { time: '13:00', action: 'Quiet hours checked', detail: 'No texts scheduled 9 PM – 8 AM guest time', channel: 'System' },
  { time: '11:30', action: 'Reminder set', detail: 'Rachel Green — Sunday welcome prep', channel: 'SMS' },
  { time: '08:15', action: 'First text sent', detail: 'James Carter — welcome message', channel: 'SMS' },
];

export const thisSunday = [
  { time: '9:00 AM', service: '1st Service', expected: 120, firstTime: 3 },
  { time: '11:00 AM', service: '2nd Service', expected: 85, firstTime: 2 },
];
