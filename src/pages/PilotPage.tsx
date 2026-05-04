import { Users, Star, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { PastorFeedbackPanel, VisitorFeedbackPanel } from '../components/pilot/FeedbackPanel';
import { IterationLog } from '../components/pilot/IterationLog';
import type { PastorFeedback, VisitorFeedback } from '../components/pilot/FeedbackPanel';
import type { IterationEntry } from '../components/pilot/IterationLog';

const pastorFeedback: PastorFeedback[] = [
  {
    name: 'Pastor James Okonkwo',
    role: 'Senior Pastor',
    rating: 5,
    comment: "Grace has been a genuine extension of our pastoral team. Visitors who would have slipped through the cracks are now getting personal, thoughtful follow-up. The concern detection alone has been worth it — we caught three situations we simply wouldn't have known about.",
    date: 'Apr 14, 2026',
    tags: ['concern detection', 'scalable', 'highly recommend'],
  },
  {
    name: 'Pastor Sarah Chen',
    role: 'Care Pastor',
    rating: 4,
    comment: "The tone is mostly right — warm and pastoral. I'd like the escalation threshold for grief-related conversations to be a little faster. Sometimes the AI goes two or three turns before flagging when I'd want to know immediately. But the quality of the briefing packets when it does escalate? Outstanding.",
    date: 'Apr 12, 2026',
    tags: ['escalation timing', 'briefing quality', 'tone adjustment needed'],
  },
  {
    name: 'Pastor Darius Bell',
    role: 'Community Pastor',
    rating: 4,
    comment: "It's impressive how naturally it surfaces small group matches. A few visitors mentioned they felt like Grace 'really knew them' after just one conversation. The Week 3 WhatsApp outreach hit a 52% reply rate which is better than anything we've done manually.",
    date: 'Apr 10, 2026',
    tags: ['community connection', 'personalization', 'messaging performance'],
  },
];

const visitorFeedback: VisitorFeedback[] = [
  { initials: 'MO', week: 1, rating: 5, comment: "I was surprised how warm the message felt. I almost thought it was a real person. It made me want to come back the following Sunday.", date: 'Apr 13', channel: 'SMS' },
  { initials: 'PS', week: 3, rating: 5, comment: "Grace suggested the Young Adults group and it felt like a perfect fit. I went last Thursday and already feel at home. Couldn't have found it without the nudge.", date: 'Apr 11', channel: 'WhatsApp' },
  { initials: 'JH', week: 2, rating: 4, comment: "The follow-up email was really nice. The sermon recap link was helpful since I had to leave early. Only thing — it came at 9AM on a Wednesday when I was at work, maybe a bit later would be better?", date: 'Apr 9', channel: 'Email' },
  { initials: 'AD', week: 4, rating: 5, comment: "I shared something personal and within a day Pastor Sarah reached out personally. I've never experienced that from a church before. It felt like they actually listened.", date: 'Apr 8', channel: 'SMS' },
  { initials: 'CW', week: 1, rating: 3, comment: "The first message was nice but the second one felt a bit soon. Maybe wait a few more days before the next touchpoint?", date: 'Apr 7', channel: 'Email' },
  { initials: 'FA', week: 5, rating: 5, comment: "I signed up for the membership class after the Week 5 message. I'd been on the fence for weeks and that SMS reminder was exactly the nudge I needed.", date: 'Apr 6', channel: 'SMS' },
];

const iterations: IterationEntry[] = [
  {
    version: 'v1.0.4',
    date: 'Apr 15, 2026',
    author: 'Pastor Sarah Chen + Dev Team',
    category: 'escalation',
    changes: [
      'Lowered grief-related escalation trigger from 3 turns to 1 turn',
      'Added immediate pastor notification for bereavement keywords',
      'Expanded grief keyword dictionary with 14 new terms',
    ],
  },
  {
    version: 'v1.0.3',
    date: 'Apr 12, 2026',
    author: 'Dev Team',
    category: 'timing',
    changes: [
      'Shifted Week 2 email delivery from 9AM to 11AM based on visitor feedback',
      'Added day-of-week preference detection for SMS delivery',
      'Increased minimum gap between Week 1 SMS and Week 1 email from 12h to 24h',
    ],
  },
  {
    version: 'v1.0.2',
    date: 'Apr 8, 2026',
    author: 'Pastor James Okonkwo',
    category: 'content',
    changes: [
      'Updated Week 6 email to include direct personal note from Senior Pastor',
      'Added 7 new approved responses to the Grief & Loss content library',
      'Revised membership class invitation copy for Week 5 SMS (improved by 12% open rate)',
    ],
  },
  {
    version: 'v1.0.1',
    date: 'Apr 3, 2026',
    author: 'Dev Team',
    category: 'tone',
    changes: [
      'Increased warmth parameter from 80% to 92% based on pilot feedback',
      'Reduced formality parameter from 55% to 31%',
      "Removed phrase 'please let us know' — replaced with more inviting language",
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Mar 30, 2026',
    author: 'Dev Team',
    category: 'channel',
    changes: [
      'Initial pilot launch with 12 visitors',
      'SMS + Email channels enabled; WhatsApp in testing',
      'Baseline escalation rules configured',
    ],
  },
];

const pilotParticipants = [
  { name: 'Marcus Okafor', week: 1, status: 'active', nps: null },
  { name: 'Priya Sharma', week: 3, status: 'active', nps: 9 },
  { name: 'Deon Williams', week: 2, status: 'active', nps: 8 },
  { name: 'Sandra Osei', week: 4, status: 'active', nps: null },
  { name: 'James Harrington', week: 5, status: 'active', nps: 10 },
  { name: 'Amara Diallo', week: 2, status: 'active', nps: 9 },
  { name: 'Chen Wei', week: 1, status: 'active', nps: 7 },
  { name: 'Fatima Al-Rasheed', week: 6, status: 'active', nps: 10 },
  { name: 'Robert Castillo', week: 6, status: 'completed', nps: 8 },
  { name: 'Nadia Torres', week: 6, status: 'completed', nps: 9 },
  { name: 'Kevin Park', week: 6, status: 'integrated', nps: 10 },
  { name: 'Jasmine Reid', week: 6, status: 'integrated', nps: 9 },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'In Pilot', color: 'bg-sky-50 text-sky-700' },
  completed: { label: 'Sequence Complete', color: 'bg-emerald-50 text-emerald-700' },
  integrated: { label: 'Integrated', color: 'bg-amber-50 text-amber-700' },
};

export function PilotPage() {
  return (
    <div className="pt-14 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Pilot Program</h1>
            <p className="text-sm text-stone-500 mt-1">
              First cohort · 12 visitors · Launched Mar 30, 2026
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-xl px-4 py-2 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Pilot Participants', value: '12', sub: '4 integrated so far', color: 'text-stone-700', bg: 'bg-stone-100' },
            { icon: Star, label: 'Avg Visitor Satisfaction', value: '4.4 / 5', sub: 'Based on 6 responses', color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: TrendingUp, label: 'Avg Response Rate', value: '78%', sub: 'vs 12% industry avg', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: AlertTriangle, label: 'Escalation Accuracy', value: '91%', sub: '3 false positives', color: 'text-rose-600', bg: 'bg-rose-50' },
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

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Pastor Feedback</h2>
            <PastorFeedbackPanel feedback={pastorFeedback} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Pilot Participants</h2>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-stone-50">
                {pilotParticipants.map((p) => {
                  const cfg = statusConfig[p.status];
                  return (
                    <div key={p.name} className="px-4 py-2.5 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-[11px] font-semibold text-stone-500 shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-800 truncate">{p.name}</p>
                        <p className="text-[11px] text-stone-400">Week {p.week}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {p.nps !== null && (
                        <span className="text-[11px] font-semibold text-amber-600 w-6 text-right shrink-0">{p.nps}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Visitor Feedback</h2>
            <VisitorFeedbackPanel feedback={visitorFeedback} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Iteration Log</h2>
            <IterationLog entries={iterations} />
          </div>
        </div>
      </div>
    </div>
  );
}
