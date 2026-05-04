import { Mail, MessageCircle, Send, Phone, Users, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { SequenceTimeline } from '../components/communications/SequenceTimeline';
import { ActiveSequences } from '../components/communications/ActiveSequences';
import type { SequenceWeek } from '../components/communications/SequenceTimeline';
import type { ActiveSequence } from '../components/communications/ActiveSequences';

const sequenceWeeks: SequenceWeek[] = [
  {
    week: 1,
    title: 'Warm Welcome',
    goal: 'Acknowledge their visit and open a line of communication',
    completedCount: 214,
    activeCount: 43,
    messages: [
      {
        channel: 'sms',
        timing: 'Same day, 2 hours after service',
        preview: `Hi {{first_name}}, it was so great having you at My Sanctuary today! I'm Grace, a pastoral care assistant. How was your experience? We'd love to hear. 💙`,
        openRate: 94,
        replyRate: 67,
      },
      {
        channel: 'email',
        timing: 'Day 2, 9AM',
        subject: 'We\'re so glad you joined us',
        preview: `Dear {{first_name}}, Thank you for spending your Sunday with us at My Sanctuary. We hope you felt the warmth of our community. Here's a little about who we are and what we believe...`,
        openRate: 71,
        replyRate: 23,
      },
    ],
  },
  {
    week: 2,
    title: 'Sunday Recap & Invite',
    goal: "Re-engage with a message about last week's sermon and invite back",
    completedCount: 178,
    activeCount: 51,
    messages: [
      {
        channel: 'email',
        timing: 'Wednesday, 10AM',
        subject: 'Catch up on Sunday\'s message',
        preview: `Hi {{first_name}}, Pastor James continued our series "Roots & Wings" this past Sunday — if you missed it or want to revisit, here's the recording. We'd love to see you this week...`,
        openRate: 58,
        replyRate: 18,
      },
      {
        channel: 'sms',
        timing: 'Saturday, 11AM',
        preview: `Hey {{first_name}}! Just a friendly reminder — we have services tomorrow at 9AM and 11AM. We'd love to see you again. Is there anything we can pray about for you?`,
        openRate: 91,
        replyRate: 44,
      },
    ],
  },
  {
    week: 3,
    title: 'Community Connection',
    goal: 'Surface small groups, ministries, or events that match their profile',
    completedCount: 143,
    activeCount: 38,
    messages: [
      {
        channel: 'whatsapp',
        timing: 'Tuesday, 10AM',
        preview: `Hi {{first_name}}! Based on what you shared with us, I thought you might love our {{suggested_group}} group — it meets on {{day}} evenings. Would you like me to connect you with the leader?`,
        openRate: 88,
        replyRate: 52,
      },
      {
        channel: 'email',
        timing: 'Thursday, 9AM',
        subject: 'Events happening this month at My Sanctuary',
        preview: `We have some great things coming up this month that we thought {{first_name}} might enjoy. From our Family Gathering on the 18th to our Young Professionals breakfast...`,
        openRate: 54,
        replyRate: 14,
      },
    ],
  },
  {
    week: 4,
    title: 'Mid-Point Check-In',
    goal: 'Gauge how the visitor is feeling about the church and uncover any concerns',
    completedCount: 112,
    activeCount: 29,
    messages: [
      {
        channel: 'sms',
        timing: 'Monday, 9AM',
        preview: `Hey {{first_name}}, it's been a few weeks since your first visit! We'd love to hear how you're settling in — have you found a community here yet, or is there anything we can help you with?`,
        openRate: 89,
        replyRate: 61,
      },
    ],
  },
  {
    week: 5,
    title: 'Deeper Invitation',
    goal: 'Invite to a serve opportunity, membership class, or deeper community',
    completedCount: 89,
    activeCount: 21,
    messages: [
      {
        channel: 'email',
        timing: 'Tuesday, 9AM',
        subject: 'Ready to go deeper?',
        preview: `Hi {{first_name}}, we've loved having you with us these past few weeks! Many people find that getting involved — whether in a small group, a serve team, or our next membership class — makes My Sanctuary truly feel like home...`,
        openRate: 62,
        replyRate: 29,
      },
      {
        channel: 'sms',
        timing: 'Friday, 12PM',
        preview: `Hi {{first_name}}, our next membership class is on the {{date}}. It's a great way to learn more and meet the pastors personally. Interested? Just reply YES and I'll save you a spot!`,
        openRate: 87,
        replyRate: 38,
      },
    ],
  },
  {
    week: 6,
    title: 'Integration & Handoff',
    goal: 'Complete the sequence, flag for pastoral follow-up, or mark as integrated',
    completedCount: 67,
    activeCount: 14,
    messages: [
      {
        channel: 'email',
        timing: 'Monday, 9AM',
        subject: 'A note from Pastor James',
        preview: `Dear {{first_name}}, I wanted to personally reach out to say how much it means to us that you've been part of our community these past weeks. I'd love to grab coffee and hear your story. My calendar is open...`,
        openRate: 79,
        replyRate: 41,
      },
      {
        channel: 'call',
        timing: 'Wednesday or Thursday, 10AM–12PM',
        preview: `Personal follow-up call from assigned pastor. Goal: Listen, affirm, and invite to next step. Talking points: How are you feeling at My Sanctuary? Have you connected with anyone? Is there anything you need from us?`,
      },
    ],
  },
];

const activeSequences: ActiveSequence[] = [
  { visitorId: '1', name: 'Marcus Okafor', week: 1, channel: 'SMS', nextTouch: 'Today 2PM', status: 'on_track' },
  { visitorId: '2', name: 'Priya Sharma', week: 3, channel: 'WhatsApp', nextTouch: 'Tomorrow 10AM', status: 'awaiting_reply' },
  { visitorId: '3', name: 'Deon Williams', week: 2, channel: 'Email', nextTouch: 'Wednesday 10AM', status: 'on_track' },
  { visitorId: '4', name: 'Sandra Osei', week: 4, channel: 'SMS', nextTouch: 'Yesterday', status: 'overdue' },
  { visitorId: '5', name: 'James Harrington', week: 5, channel: 'Email', nextTouch: 'Thursday 9AM', status: 'on_track' },
  { visitorId: '6', name: 'Amara Diallo', week: 2, channel: 'SMS', nextTouch: 'Saturday 11AM', status: 'awaiting_reply' },
  { visitorId: '7', name: 'Chen Wei', week: 1, channel: 'Email', nextTouch: 'Tomorrow 9AM', status: 'on_track' },
  { visitorId: '8', name: 'Fatima Al-Rasheed', week: 6, channel: 'Call', nextTouch: 'Wednesday 10AM', status: 'on_track' },
];

const channelStats = [
  { icon: MessageCircle, label: 'SMS', sent: 1847, opened: 1712, replied: 891, color: 'text-sky-600', bg: 'bg-sky-50' },
  { icon: Mail, label: 'Email', sent: 2214, opened: 1381, replied: 419, color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Send, label: 'WhatsApp', sent: 634, opened: 558, replied: 312, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Phone, label: 'Calls', sent: 189, opened: 189, replied: 147, color: 'text-violet-600', bg: 'bg-violet-50' },
];

export function CommunicationsPage() {
  return (
    <div className="pt-14 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Communications Orchestrator</h1>
            <p className="text-sm text-stone-500 mt-1">
              Six-week follow-up sequence with multi-channel outreach
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'In Active Sequence', value: '196', sub: 'across all 6 weeks', color: 'text-stone-700', bg: 'bg-stone-100' },
            { icon: CheckCircle, label: 'Sequences Completed', value: '803', sub: 'since launch', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: TrendingUp, label: 'Avg Response Rate', value: '43%', sub: 'across all channels', color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: AlertCircle, label: 'Concerns Surfaced', value: '31', sub: 'escalated to pastors', color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} strokeWidth={1.75} />
              </div>
              <p className="text-2xl font-semibold text-stone-900">{stat.value}</p>
              <p className="text-sm text-stone-500 mt-0.5">{stat.label}</p>
              <p className="text-xs text-stone-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {channelStats.map((ch) => (
            <div key={ch.label} className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${ch.bg} flex items-center justify-center mb-3`}>
                <ch.icon className={`w-4 h-4 ${ch.color}`} />
              </div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">{ch.label}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Sent</span>
                  <span className="font-medium text-stone-700">{ch.sent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Opened</span>
                  <span className="font-medium text-stone-700">{ch.opened.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">Replied</span>
                  <span className={`font-medium ${ch.color}`}>{ch.replied.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-50">
                <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current opacity-40"
                    style={{ width: `${Math.round((ch.replied / ch.sent) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">{Math.round((ch.replied / ch.sent) * 100)}% reply rate</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">6-Week Sequence</h2>
            <SequenceTimeline weeks={sequenceWeeks} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Visitor Sequences</h2>
            <ActiveSequences sequences={activeSequences} />
          </div>
        </div>
      </div>
    </div>
  );
}
