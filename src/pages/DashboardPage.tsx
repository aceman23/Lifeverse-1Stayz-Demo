import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageCircle, UserCheck, ChevronRight, CheckCircle2,
  Zap, ArrowLeft, Sparkles, X, Gift,
} from 'lucide-react';
import { useDashboardStats, useVisitorPipeline, useAIRecommendation } from '../lib/hooks';
import type { Visitor } from '../lib/types';

function fullName(v: Visitor) {
  return `${v.first_name} ${v.last_name}`.trim();
}

function initials(v: Visitor) {
  return `${v.first_name[0] ?? ''}${v.last_name[0] ?? ''}`.toUpperCase();
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'engaged':
    case 'concern_confirmed':
      return { label: 'Very Engaged', className: 'bg-green-100 text-green-700 border border-green-200' };
    case 'concern_raised':
    case 'escalated':
      return { label: 'Needs Attention', className: 'bg-amber-100 text-amber-700 border border-amber-200' };
    case 'contacted':
      return { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border border-blue-200' };
    default:
      return { label: 'New', className: 'bg-stone-100 text-stone-600 border border-stone-200' };
  }
}

function getSubLabel(visitor: Visitor) {
  const tag = visitor.segmentation_tags?.find((t) => t.startsWith('sub:'));
  if (tag) return tag.replace('sub:', '');
  if (visitor.notes?.toLowerCase().includes('moved')) return 'Recently moved';
  return 'First-time guest';
}

const TIMES = [
  { day: 'Thursday, May 16', time: '10:00 AM' },
  { day: 'Thursday, May 16', time: '4:00 PM' },
  { day: 'Saturday, May 18', time: '9:30 AM' },
];

/* ── 4A: Respond (Yes Path) ─────────────────────────────────────── */
function RespondModal({ visitor, onClose }: { visitor: Visitor; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="w-14 h-14 rounded-full bg-[#2ec27e] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          <p className="text-base font-semibold text-stone-800">Meeting time sent!</p>
          <p className="text-sm text-stone-500 text-center max-w-xs">
            {fullName(visitor)} will receive a confirmation. We'll follow up automatically.
          </p>
          <button onClick={onClose} className="mt-2 text-sm text-[#2ec27e] font-semibold hover:underline">
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-stone-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1a2e2a] flex items-center justify-center text-white text-xs font-bold shrink-0">
            4A
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800 uppercase tracking-wide">Response: Yes Path</p>
            <p className="text-[11px] text-stone-400">Positive response — move to next step</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-3 pb-5 space-y-4">
        {/* Back + visitor name */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {visitor.first_name}
          </button>
          <Avatar visitor={visitor} size="sm" />
        </div>

        {/* Confirmation banner */}
        <div className="flex items-start gap-3 bg-[#eaf7f1] border border-[#2ec27e]/30 rounded-xl px-4 py-3">
          <div className="w-7 h-7 rounded-full bg-[#2ec27e] flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">Great! We're so glad you got it.</p>
            <p className="text-xs text-stone-500 mt-0.5">What was your impression of your visit?</p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="border border-stone-100 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wide">AI Insight</p>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Positive sentiment detected.<br />
            {visitor.first_name} is ready for a deeper connection.<br />
            Recommend scheduling a coffee with our pastor team.
          </p>
        </div>

        {/* Time slots */}
        <div>
          <p className="text-sm font-semibold text-stone-800 mb-0.5">Let's grab coffee!</p>
          <p className="text-xs text-stone-400 mb-3">Pick a time that works for you.</p>
          <div className="space-y-2">
            {TIMES.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  selected === i
                    ? 'border-[#2ec27e] bg-[#eaf7f1]'
                    : 'border-stone-100 bg-white hover:border-stone-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  selected === i ? 'border-[#2ec27e]' : 'border-stone-300'
                }`}>
                  {selected === i && <div className="w-2 h-2 rounded-full bg-[#2ec27e]" />}
                </div>
                <span className="text-sm text-stone-700">{t.day}</span>
                <span className="ml-auto text-sm font-semibold text-stone-800">{t.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setConfirmed(true)}
          className="w-full bg-[#1a2e2a] hover:bg-[#243d37] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Choose This Time
        </button>
      </div>
    </ModalShell>
  );
}

/* ── 4B: Snooze (No Path) ───────────────────────────────────────── */
function SnoozeModal({ visitor, onClose }: { visitor: Visitor; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
            <Gift className="w-7 h-7 text-amber-600" strokeWidth={1.5} />
          </div>
          <p className="text-base font-semibold text-stone-800">Coffee invite sent!</p>
          <p className="text-sm text-stone-500 text-center max-w-xs">
            We'll make sure {visitor.first_name} gets a warm invite and feels welcome.
          </p>
          <button onClick={onClose} className="mt-2 text-sm text-[#2ec27e] font-semibold hover:underline">
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-stone-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#c4a882] flex items-center justify-center text-white text-xs font-bold shrink-0">
            4B
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800 uppercase tracking-wide">Response: No Path</p>
            <p className="text-[11px] text-stone-400">Recover and invite to coffee</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-3 pb-5 space-y-4">
        {/* Back + visitor avatar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {visitor.first_name}
          </button>
          <Avatar visitor={visitor} size="sm" />
        </div>

        {/* Recovery banner */}
        <div className="flex items-start gap-3 bg-[#fdf6ee] border border-amber-200/60 rounded-xl px-4 py-3">
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-base leading-none">😊</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-stone-800">No problem at all!</p>
            <p className="text-xs text-stone-500 mt-0.5">Let's make sure you get your gift.</p>
          </div>
          <Gift className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />
        </div>

        {/* Coffee invite copy */}
        <div className="border border-stone-100 rounded-xl px-4 py-3 bg-white">
          <p className="text-sm font-semibold text-stone-800 leading-snug mb-1">
            Would you be open to a quick coffee<br />with one of our pastors this week?
          </p>
          <p className="text-xs text-stone-400">We'd love to get to know you better.</p>
        </div>

        {/* Time slots */}
        <div>
          <p className="text-sm font-semibold text-stone-800 mb-0.5">Let's grab coffee!</p>
          <p className="text-xs text-stone-400 mb-3">Pick a time that works for you.</p>
          <div className="space-y-2">
            {TIMES.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  selected === i
                    ? 'border-[#2ec27e] bg-[#eaf7f1]'
                    : 'border-stone-100 bg-white hover:border-stone-200'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  selected === i ? 'border-[#2ec27e]' : 'border-stone-300'
                }`}>
                  {selected === i && <div className="w-2 h-2 rounded-full bg-[#2ec27e]" />}
                </div>
                <span className="text-sm text-stone-700">{t.day}</span>
                <span className="ml-auto text-sm font-semibold text-stone-800">{t.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setConfirmed(true)}
          className="w-full bg-[#1a2e2a] hover:bg-[#243d37] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          Choose This Time
        </button>
      </div>
    </ModalShell>
  );
}

/* ── Shared modal shell ─────────────────────────────────────────── */
function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end px-4 pt-3">
          <button onClick={onClose} className="text-stone-300 hover:text-stone-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── AI Recommendations panel ───────────────────────────────────── */
function AIRecommendationsPanel({ visitors }: { visitors: Visitor[] }) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<'respond' | 'snooze' | null>(null);

  const active = visitors.filter((v) => !dismissed.has(v.id));
  const current = active[index % Math.max(active.length, 1)] ?? null;

  const dismiss = (id: string) => {
    setDismissed((s) => new Set(s).add(id));
    setModal(null);
  };

  if (active.length === 0) {
    return (
      <div className="w-64 shrink-0 bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center py-10 px-4 gap-3">
        <CheckCircle2 className="w-8 h-8 text-[#2ec27e]" strokeWidth={1.5} />
        <p className="text-sm text-stone-500 text-center font-medium">All caught up!</p>
        <p className="text-xs text-stone-400 text-center">No pending recommendations.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-64 shrink-0 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-50">
          <span className="text-sm font-semibold text-stone-800">AI Recommendations</span>
          <div className="flex items-center gap-2">
            {active.length > 1 && (
              <span className="text-[10px] text-stone-400">{(index % active.length) + 1}/{active.length}</span>
            )}
            <span className="text-[10px] font-bold text-white bg-[#2ec27e] px-2 py-0.5 rounded-full tracking-wide">NEW</span>
          </div>
        </div>

        {current && (
          <div className="px-4 py-4">
            <div className="flex gap-3">
              <Avatar visitor={current} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800">{fullName(current)}</p>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {current.follow_up_status === 'concern_raised' || current.follow_up_status === 'escalated'
                    ? 'Needs attention. Recommend reaching out personally.'
                    : 'High engagement detected. Recommend scheduling a coffee meeting.'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setModal('respond')}
                className="flex-1 bg-[#1a2e2a] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#243d37] transition-colors"
              >
                Respond
              </button>
              <button
                onClick={() => setModal('snooze')}
                className="flex-1 bg-stone-100 text-stone-600 text-xs font-semibold py-2 rounded-lg hover:bg-stone-200 transition-colors"
              >
                Snooze
              </button>
            </div>
            {active.length > 1 && (
              <button
                onClick={() => setIndex((i) => (i + 1) % active.length)}
                className="w-full mt-2 text-[11px] text-[#2ec27e] hover:underline text-center"
              >
                Next recommendation
              </button>
            )}
          </div>
        )}
      </div>

      {modal === 'respond' && current && (
        <RespondModal visitor={current} onClose={() => { dismiss(current.id); }} />
      )}
      {modal === 'snooze' && current && (
        <SnoozeModal visitor={current} onClose={() => { dismiss(current.id); }} />
      )}
    </>
  );
}

/* ── Visitor row ────────────────────────────────────────────────── */
function Avatar({ visitor, size = 'sm' }: { visitor: Visitor; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-10 h-10' : 'w-9 h-9';
  const text = size === 'lg' ? 'text-sm' : 'text-xs';
  if (visitor.avatar_url) {
    return (
      <img
        src={visitor.avatar_url}
        alt={fullName(visitor)}
        className={`${dim} rounded-full object-cover shrink-0 ring-1 ring-stone-100`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-[#1a2e2a] to-[#2ec27e] flex items-center justify-center text-white ${text} font-semibold shrink-0`}>
      {initials(visitor)}
    </div>
  );
}

function VisitorRow({ visitor, onClick }: { visitor: Visitor; onClick: () => void }) {
  const badge = getStatusBadge(visitor.follow_up_status ?? '');
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors group border-b border-stone-50 last:border-0 text-left"
    >
      <Avatar visitor={visitor} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 truncate">{fullName(visitor)}</p>
        <p className="text-xs text-stone-400 truncate">{getSubLabel(visitor)}</p>
      </div>
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.className}`}>
        {badge.label}
      </span>
      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
    </button>
  );
}

/* ── Dashboard page ─────────────────────────────────────────────── */
export function DashboardPage() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { visitors, loading: visitorsLoading } = useVisitorPipeline();
  const { visitor: aiVisitor, loading: aiLoading } = useAIRecommendation();

  const aiVisitors = aiVisitor
    ? [aiVisitor, ...visitors.filter((v) => v.id !== aiVisitor.id)]
    : visitors;

  const statItems = [
    {
      value: statsLoading ? '—' : stats.newVisitorsThisWeek,
      label: 'New Guests',
      sub: 'This Week',
      icon: Users,
      iconBg: 'bg-[#eaf7f1]',
      iconColor: 'text-[#2ec27e]',
    },
    {
      value: statsLoading ? '—' : stats.inConversation,
      label: 'In Conversation',
      sub: 'Now',
      icon: MessageCircle,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      value: statsLoading ? '—' : stats.concernsRaised,
      label: 'Returning Soon',
      sub: 'This Week',
      icon: UserCheck,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 leading-tight">
          Save These Visitors.<br />Reap the Harvest Given to You.
        </h1>
        <p className="text-sm text-stone-400 mt-2">Agentic AI that recognizes, remembers, and responds.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statItems.map(({ value, label, sub, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-2xl font-bold text-stone-800 leading-none">{value}</div>
              <div className="text-xs font-medium text-stone-700 mt-0.5">{label}</div>
              <div className="text-[11px] text-stone-400">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Follow-Up Engine live card */}
      <div className="mb-6">
        <div className="bg-[#1a2e2a] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-stretch">
            <div className="flex-1 px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white font-bold text-base">Follow-Up Engine</span>
                <span className="bg-[#2ec27e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">Live</span>
              </div>
              <ul className="space-y-2">
                {['Capturing visitors', 'Sending messages', 'Adapting channels', 'Scheduling meetings'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec27e] shrink-0" strokeWidth={2} />
                    <span className="text-white/80 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-36 flex items-center justify-center pr-6 shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2ec27e]/30 to-[#2ec27e]/10 border border-[#2ec27e]/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2ec27e] to-[#1a8a57] flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* People saved + AI recommendations */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-50">
            <span className="text-sm font-semibold text-stone-800">People We Saved From Leaving</span>
            <button onClick={() => navigate('/people')} className="text-xs text-[#2ec27e] font-semibold hover:underline">View all</button>
          </div>
          <div>
            {visitorsLoading ? (
              <div className="px-4 py-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-stone-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : visitors.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-stone-400">No visitors to display yet.</div>
            ) : (
              visitors.slice(0, 5).map((v) => <VisitorRow key={v.id} visitor={v} onClick={() => navigate(`/visitor/${v.id}`)} />)
            )}
          </div>
        </div>

        {aiLoading ? (
          <div className="w-64 shrink-0 bg-white rounded-2xl border border-stone-100 shadow-sm flex items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-2 border-[#2ec27e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AIRecommendationsPanel visitors={aiVisitors} />
        )}
      </div>
    </div>
  );
}
