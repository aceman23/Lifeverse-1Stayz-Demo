import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../lib/onboarding-context';
import { todayTasks as initialTasks, pilotHealth, agentActivity, escalations as initialEscalations, type TodayTask, type Escalation } from '../data/today';
import {
  AlertTriangle, Clock, Check, ChevronRight, Eye, Activity, Calendar,
  MessageSquare, BellOff, Undo, Send, Edit3, Trash2,
  MoreVertical, Heart, X, Users, BarChart2, Settings as SettingsIcon, Smartphone, Mail, Globe,
} from 'lucide-react';
import { SpecMarker } from '../components/ui/SpecMarker';

type RankType = 'escalation' | 'approval' | 'follow-up' | 'risk' | 'returning' | 'prep';

interface RankedItem {
  rank: number;
  type: RankType;
  task?: TodayTask;
  escalation?: Escalation;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Overdue';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCountdownMin(ms: number): string {
  if (ms <= 0) return 'Overdue';
  const totalMin = Math.floor(ms / 60000);
  if (totalMin >= 1) return `${totalMin} min`;
  return '< 1 min';
}

function formatServiceTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const dh = h % 12 || 12;
  return `${dh}:${String(m).padStart(2, '0')} ${ampm}`;
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

const CHANNEL_ICONS: Record<string, typeof Smartphone> = {
  SMS: Smartphone,
  Email: Mail,
  Web: Globe,
};

const TYPE_META: Record<RankType, { label: string; chipClass: string; badgeClass: string; icon: typeof Eye }> = {
  escalation: { label: 'Escalation', chipClass: 'bg-danger-tint text-danger', badgeClass: 'bg-danger text-white', icon: AlertTriangle },
  approval: { label: 'Draft ready', chipClass: 'bg-success-tint text-success', badgeClass: 'bg-success text-white', icon: Check },
  'follow-up': { label: 'Replied', chipClass: 'bg-info-tint text-info', badgeClass: 'bg-info text-white', icon: MessageSquare },
  risk: { label: 'Needs follow-up', chipClass: 'bg-warning-tint text-warning', badgeClass: 'bg-warning text-white', icon: Clock },
  returning: { label: 'Upcoming', chipClass: 'bg-info-tint text-info', badgeClass: 'bg-info text-white', icon: Calendar },
  prep: { label: 'Sunday prep', chipClass: 'bg-ink/5 text-ink-2', badgeClass: 'bg-ink-2 text-white', icon: Eye },
};

export function TodayPage() {
  const navigate = useNavigate();
  const { state } = useOnboarding();
  const mode = state.mode;
  const [showToast, setShowToast] = useState(false);
  const [tasks, setTasks] = useState<TodayTask[]>(initialTasks);
  const [escalationList, setEscalationList] = useState<Escalation[]>(initialEscalations);
  const [now, setNow] = useState(Date.now());
  const [nowMin, setNowMin] = useState(Date.now());
  const [drawerFor, setDrawerFor] = useState<string | null>(null);
  const [overflowFor, setOverflowFor] = useState<string | null>(null);
  const [snoozeFor, setSnoozeFor] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [notPriorityFor, setNotPriorityFor] = useState<string | null>(null);
  const [sundaySheetOpen, setSundaySheetOpen] = useState(false);
  const [assignFor, setAssignFor] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNowMin(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const justStarted = sessionStorage.getItem('1stayz_shadow_just_started');
    if (justStarted === '1') {
      setShowToast(true);
      sessionStorage.removeItem('1stayz_shadow_just_started');
      const t = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const yourName = state.church.yourName || 'Pastor Ray';
  const churchTz = state.church.timezone || 'America/Chicago (CT)';

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Build ranked list
  const rankedItems: RankedItem[] = [];
  let rank = 1;
  escalationList.forEach((esc) => { rankedItems.push({ rank, type: 'escalation', escalation: esc }); rank++; });
  if (mode === 'shadow') {
    tasks.filter((t) => t.status === 'approval').forEach((t) => { rankedItems.push({ rank, type: 'approval', task: t }); rank++; });
  }
  tasks.filter((t) => t.status === 'follow-up').forEach((t) => { rankedItems.push({ rank, type: 'follow-up', task: t }); rank++; });
  tasks.filter((t) => t.status === 'risk').forEach((t) => { rankedItems.push({ rank, type: 'risk', task: t }); rank++; });
  tasks.filter((t) => t.status === 'returning').forEach((t) => { rankedItems.push({ rank, type: 'returning', task: t }); rank++; });
  tasks.filter((t) => t.status === 'prep').forEach((t) => { rankedItems.push({ rank, type: 'prep', task: t }); rank++; });

  const doneTasks = tasks.filter((t) => t.status === 'done');
  const peopleCount = rankedItems.length;
  const doneCount = doneTasks.length;

  function removeItem(id: string) {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setRemovingIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }, 300);
  }

  function handleApprove(taskId: string) {
    setDrawerFor(null);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'done' } : t)));
  }

  function handleDiscard(taskId: string) {
    setDrawerFor(null);
    removeItem(taskId);
  }

  function handleSnooze(id: string) {
    setSnoozeFor(null);
    setOverflowFor(null);
    removeItem(id);
  }

  function handleNotPriority(id: string) {
    setNotPriorityFor(null);
    setOverflowFor(null);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)));
  }

  function handleUndo(taskId: string) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'follow-up' } : t)));
  }

  function handleAssign(escalationId: string) {
    setAssignFor(null);
    setEscalationList((prev) => prev.filter((e) => e.id !== escalationId));
  }

  function handlePrepareWelcome(taskId: string) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'done' } : t)));
  }

  const staffMembers = state.staff;
  const sundayServices = state.serviceSchedule.length > 0 ? state.serviceSchedule : [];
  const heroEsc = escalationList[0];

  return (
    <div className="min-h-screen pb-10" style={{ background: 'var(--background)' }}>
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 text-white text-sm font-medium px-5 py-3 rounded-12 shadow-soft flex items-center gap-2" style={{ background: 'var(--text-primary)' }}>
          <Check className="w-4 h-4" style={{ color: 'var(--brand-teal)' }} />
          {mode === 'live' ? 'Welcome to Live mode — messages send automatically.' : 'Welcome to Shadow mode — review every message before it sends.'}
        </div>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-surface border-b flex items-center justify-between px-4" style={{ borderColor: 'var(--border)', height: '56px' }}>
        <img src="/LVHI_1Stayz.png" alt="1Stayz" className="h-auto" style={{ height: '32px', objectFit: 'contain' }} />
        <div className="flex items-center gap-2">
          <ModePill mode={mode} />
          <button className="relative p-2" style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BellIcon />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'var(--text-primary)' }}>
            {yourName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 pt-6 lg:pt-8">
        <div className="max-w-[1100px] mx-auto">
          {/* Greeting */}
          <SpecMarker id="today.header">
          <div className="mb-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-bold text-ink" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
                  {greeting}, {yourName}.
                </h1>
                <p className="text-ink-2 text-sm mt-1">Here is your personalized action list.</p>
              </div>
              <div className="text-right">
                <p className="text-ink-2 text-sm font-medium">{dateStr}</p>
                <p className="text-ink-3 text-xs">{timeStr} · {churchTz}</p>
              </div>
            </div>
            <p className="text-xs text-ink-2 mt-2">
              <span className="font-semibold text-ink">{peopleCount} people need you</span>
              <span className="text-ink-3"> · </span>
              <span>{doneCount} done today</span>
            </p>
          </div>
          </SpecMarker>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT column */}
            <div className="flex-1 space-y-4" style={{ maxWidth: '760px' }}>
              {/* Hero card — Priority 1 escalation */}
              {heroEsc && (
                <SpecMarker id="today.urgent">
                <div
                  className="rounded-20 p-5 md:p-6"
                  style={{ background: 'var(--danger-tint)', border: '1px solid rgba(200,16,46,0.2)' }}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex items-center justify-center text-white text-xs font-bold rounded-lg shrink-0"
                        style={{ width: '28px', height: '28px', background: 'var(--danger)' }}
                        aria-label="Priority 1"
                      >
                        1
                      </span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
                        Priority 1 — Needs a pastor
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setWhyOpen(!whyOpen)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface text-ink-2 hover:text-ink transition-colors"
                        style={{ minHeight: '32px', border: '1px solid var(--border)' }}
                      >
                        Why?
                      </button>
                      <button
                        onClick={() => setAssignFor(assignFor === heroEsc.id ? null : heroEsc.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface text-ink-2 hover:text-ink transition-colors"
                        style={{ minHeight: '32px', border: '1px solid var(--border)' }}
                      >
                        Reassign
                      </button>
                    </div>
                  </div>

                  {whyOpen && (
                    <div className="mb-4 p-3 rounded-12 bg-surface text-sm text-ink-2 animate-slide-down" style={{ border: '1px solid var(--border)' }}>
                      {heroEsc.whyText || heroEsc.reason}
                    </div>
                  )}

                  {assignFor === heroEsc.id && (
                    <div className="mb-4 p-3 rounded-12 bg-surface animate-slide-down" style={{ border: '1px solid var(--border)' }}>
                      <p className="text-xs font-medium text-ink-2 mb-2">Assign to a staff member:</p>
                      <div className="space-y-1">
                        {staffMembers.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleAssign(heroEsc.id)}
                            className="w-full text-left px-2 py-2 rounded-lg hover:bg-bg transition-colors flex items-center gap-2"
                          >
                            <div className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center text-[10px] font-semibold text-ink shrink-0">
                              {s.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-ink">{s.name}</p>
                              <p className="text-[10px] text-ink-3">{s.role}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Body: avatar + quote */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-start gap-3 md:w-1/3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${heroEsc.avatarColor} flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
                        {heroEsc.guestInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-ink">{heroEsc.guestName}</p>
                        <p className="text-xs text-ink-2 mt-0.5">First visit · {heroEsc.visitDate || 'Sep 27'}</p>
                        <p className="text-xs text-ink-2">{heroEsc.serviceName || '11:00 AM service'}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {(() => {
                            const ChIcon = CHANNEL_ICONS[heroEsc.channel] ?? Smartphone;
                            return <ChIcon className="w-3 h-3 text-ink-3" />;
                          })()}
                          <span className="text-xs text-ink-3">{heroEsc.channel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 md:border-l md:pl-4" style={{ borderColor: 'rgba(200,16,46,0.15)' }}>
                      <blockquote className="text-ink font-semibold leading-snug" style={{ fontSize: '22px' }}>
                        "{heroEsc.quote || heroEsc.reason}"
                      </blockquote>
                      <p className="text-sm text-ink-2 mt-2 leading-relaxed">
                        {heroEsc.summary || heroEsc.reason}
                      </p>
                      {heroEsc.factChips && heroEsc.factChips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {heroEsc.factChips.map((chip) => (
                            <span key={chip} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-surface text-ink-2" style={{ border: '1px solid var(--border)' }}>
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mt-4 p-3 rounded-12 bg-surface flex items-center gap-2" style={{ border: '1px solid var(--border)' }}>
                    <Heart className="w-4 h-4 shrink-0" style={{ color: 'var(--brand-teal)' }} />
                    <p className="text-sm text-ink-2">1Stayz recommends: <span className="font-semibold text-ink">Respond personally now.</span></p>
                  </div>

                  {/* Timer + actions */}
                  <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                    <CountdownPill openedAt={heroEsc.openedAt} now={now} nowMin={nowMin} />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('/conversations')}
                        className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-12 text-white transition-opacity hover:opacity-90"
                        style={{ background: 'var(--brand-teal)', minHeight: '44px' }}
                      >
                        Reply to {heroEsc.guestName.split(' ')[0]} <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="text-sm font-medium text-ink-2 hover:text-ink transition-colors px-2" style={{ minHeight: '44px' }}>
                        Call instead
                      </button>
                    </div>
                  </div>
                </div>
                </SpecMarker>
              )}

              {/* Ranked list */}
              <SpecMarker id="today.tasks">
              <div className="space-y-3">
                {rankedItems.filter((_, i) => i > 0 || !heroEsc).map((item) => {
                  const task = item.task;
                  if (!task) return null;
                  const meta = TYPE_META[item.type];
                  const isRemoving = removingIds.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className={`rounded-20 p-4 md:p-5 bg-surface ${isRemoving ? 'animate-collapse-out' : ''}`}
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex items-center justify-center text-xs font-bold rounded-lg shrink-0"
                          style={{ width: '28px', height: '28px', background: `var(--${meta.badgeClass.split(' ')[0].replace('bg-', '').replace('text-white', '')})`, color: 'white' }}
                          aria-label={`Priority ${item.rank}`}
                        >
                          {item.rank}
                        </span>
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${task.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                          {task.guestInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink" style={{ fontSize: '17px' }}>{task.guestName}</p>
                          <p className="text-ink text-sm mt-0.5">{task.detail}</p>
                          {task.meta && <p className="text-ink-2 text-xs mt-0.5">{task.meta}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${meta.chipClass}`}>
                            <meta.icon className="w-3 h-3" />
                            {meta.label}
                          </span>
                        </div>
                      </div>

                      {/* Action row */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {item.type === 'approval' && (
                          <button
                            onClick={() => setDrawerFor(drawerFor === task.id ? null : task.id)}
                            className="text-xs font-semibold px-3.5 py-2 rounded-12 bg-surface text-ink transition-colors hover:bg-bg"
                            style={{ minHeight: '36px', border: '1px solid var(--border)' }}
                          >
                            Review & send
                          </button>
                        )}
                        {item.type === 'follow-up' && (
                          <button
                            onClick={() => navigate('/conversations')}
                            className="text-xs font-semibold px-3.5 py-2 rounded-12 bg-surface text-ink transition-colors hover:bg-bg"
                            style={{ minHeight: '36px', border: '1px solid var(--border)' }}
                          >
                            Reply
                          </button>
                        )}
                        {item.type === 'risk' && (
                          <button
                            className="text-xs font-semibold px-3.5 py-2 rounded-12 bg-surface text-ink transition-colors hover:bg-bg"
                            style={{ minHeight: '36px', border: '1px solid var(--border)' }}
                          >
                            Call {task.guestName.split(' ')[0]}
                          </button>
                        )}
                        {item.type === 'returning' && (
                          <button
                            onClick={() => handlePrepareWelcome(task.id)}
                            className="text-xs font-semibold px-3.5 py-2 rounded-12 bg-surface text-ink transition-colors hover:bg-bg"
                            style={{ minHeight: '36px', border: '1px solid var(--border)' }}
                          >
                            Prepare welcome
                          </button>
                        )}
                        {item.type === 'prep' && (
                          <button
                            className="text-xs font-semibold px-3.5 py-2 rounded-12 bg-surface text-ink transition-colors hover:bg-bg"
                            style={{ minHeight: '36px', border: '1px solid var(--border)' }}
                          >
                            Fix
                          </button>
                        )}

                        {/* Overflow menu */}
                        <div className="relative ml-auto">
                          <button
                            onClick={() => setOverflowFor(overflowFor === task.id ? null : task.id)}
                            className="p-2 rounded-lg text-ink-3 hover:text-ink hover:bg-bg transition-colors"
                            style={{ minHeight: '36px', minWidth: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {overflowFor === task.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setOverflowFor(null)} />
                              <div className="absolute right-0 top-full mt-1 w-44 bg-surface rounded-12 shadow-soft z-40 overflow-hidden animate-slide-down" style={{ border: '1px solid var(--border)' }}>
                                <div className="relative">
                                  <button
                                    onClick={() => { setSnoozeFor(snoozeFor === task.id ? null : task.id); }}
                                    className="w-full text-left px-3 py-2.5 text-xs text-ink-2 hover:bg-bg transition-colors flex items-center gap-2"
                                  >
                                    <BellOff className="w-3.5 h-3.5" /> Snooze
                                  </button>
                                  {snoozeFor === task.id && (
                                    <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                                      <button onClick={() => handleSnooze(task.id)} className="w-full text-left px-3 py-2 text-xs text-ink-2 hover:bg-bg transition-colors pl-8">1 day</button>
                                      <button onClick={() => handleSnooze(task.id)} className="w-full text-left px-3 py-2 text-xs text-ink-2 hover:bg-bg transition-colors pl-8">3 days</button>
                                      <button onClick={() => handleSnooze(task.id)} className="w-full text-left px-3 py-2 text-xs text-ink-2 hover:bg-bg transition-colors pl-8">Next week</button>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => { setOverflowFor(null); setNotPriorityFor(task.id); }}
                                    className="w-full text-left px-3 py-2.5 text-xs text-ink-2 hover:bg-bg transition-colors flex items-center gap-2 border-t"
                                    style={{ borderColor: 'var(--border)' }}
                                  >
                                    <X className="w-3.5 h-3.5" /> Not a priority
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Not a priority reason picker */}
                      {notPriorityFor === task.id && (
                        <div className="mt-3 p-3 rounded-12 animate-slide-down" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                          <p className="text-xs font-medium text-ink-2 mb-2">Why is this not a priority?</p>
                          <div className="flex flex-wrap gap-2">
                            {['Already handled', 'Not relevant', 'Wrong person'].map((reason) => (
                              <button
                                key={reason}
                                onClick={() => handleNotPriority(task.id)}
                                className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface text-ink-2 hover:text-ink transition-colors"
                                style={{ border: '1px solid var(--border)' }}
                              >
                                {reason}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Approval drawer */}
                      {drawerFor === task.id && task.draftMessage && (
                        <div className="mt-3 p-4 rounded-12 animate-slide-down" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                          <p className="text-xs font-medium text-ink-2 mb-2">Drafted reply:</p>
                          <p className="text-sm text-ink leading-relaxed mb-3">{task.draftMessage}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleApprove(task.id)}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-12 text-white transition-opacity hover:opacity-90"
                              style={{ background: 'var(--brand-teal)', minHeight: '36px' }}
                            >
                              <Send className="w-3.5 h-3.5" /> Approve & send
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-12 bg-surface text-ink-2 hover:text-ink transition-colors" style={{ minHeight: '36px', border: '1px solid var(--border)' }}>
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDiscard(task.id)}
                              className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-12 bg-surface text-ink-3 hover:text-danger transition-colors"
                              style={{ minHeight: '36px', border: '1px solid var(--border)' }}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Discard
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty state */}
                {rankedItems.length === 0 && (
                  <div className="rounded-20 p-8 text-center bg-surface" style={{ border: '1px solid var(--border)' }}>
                    <Check className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--success)' }} />
                    <p className="text-sm font-medium text-ink">You're all caught up.</p>
                    <p className="text-xs text-ink-2 mt-1">1Stayz is watching the conversations and will bring you anything that needs a person.</p>
                  </div>
                )}

                {/* Done today */}
                {doneTasks.length > 0 && (
                  <div className="rounded-20 p-4 bg-surface" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-4 h-4" style={{ color: 'var(--success)' }} />
                      <p className="text-sm font-medium text-ink-2">Done today ({doneTasks.length})</p>
                    </div>
                    <div className="space-y-1">
                      {doneTasks.map((t) => (
                        <div key={t.id} className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-ink-3 truncate line-through">{t.guestName} — {t.detail}</span>
                          </div>
                          <button
                            onClick={() => handleUndo(t.id)}
                            className="text-xs font-medium text-ink-2 hover:text-ink transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Undo className="w-3 h-3" /> Undo
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </SpecMarker>

              {/* Shortcut tiles */}
              <SpecMarker id="today.leaders">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <ShortcutTile icon={Users} label="View all relationships" onClick={() => navigate('/people')} />
                <ShortcutTile icon={BarChart2} label="Insights & reports" onClick={() => navigate('/insights')} />
                <ShortcutTile icon={Calendar} label="This Sunday" onClick={() => setSundaySheetOpen(true)} />
                <ShortcutTile icon={SettingsIcon} label="Settings" onClick={() => navigate('/settings')} />
              </div>
              </SpecMarker>
            </div>

            {/* RIGHT rail (desktop) */}
            <div className="hidden lg:block w-80 shrink-0 space-y-4">
              <div className="sticky top-20 space-y-4">
                <SpecMarker id="today.pilot_health">
                <RailCard title="Pilot health vs targets">
                  <div className="space-y-2.5">
                    {pilotHealth.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-ink truncate">{item.label}</p>
                          <p className="text-[10px] text-ink-3">Target: {item.target}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs font-semibold" style={{ color: item.onTrack ? 'var(--success)' : 'var(--warning)' }}>{item.current}</span>
                          <div className="w-2 h-2 rounded-full" style={{ background: item.onTrack ? 'var(--success)' : 'var(--warning)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </RailCard>
                </SpecMarker>

                <SpecMarker id="today.agent_activity">
                <RailCard title="Agent activity" icon={Activity}>
                  <div className="space-y-2">
                    {agentActivity.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-[10px] text-ink-3 tabular-nums shrink-0 mt-0.5">{item.time}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-ink truncate">{item.action}</p>
                          <p className="text-[10px] text-ink-3 truncate">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RailCard>
                </SpecMarker>

                <RailCard title="This Sunday" icon={Calendar}>
                  {sundayServices.length > 0 ? (
                    <div className="space-y-2">
                      {sundayServices.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--background)' }}>
                          <div>
                            <p className="text-xs font-medium text-ink">{formatServiceTime(s.startTime)}</p>
                            <p className="text-[10px] text-ink-3">{s.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-ink-3">Send by</p>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--brand-teal-text)' }}>{formatServiceTime(addMinutes(s.endTime, 30))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-3">No services scheduled.</p>
                  )}
                </RailCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sunday sheet */}
      {sundaySheetOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSundaySheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-[480px] max-h-[80vh] overflow-y-auto bg-surface rounded-t-20 md:rounded-20 shadow-soft animate-slide-down" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-ink">This Sunday</h3>
              <button onClick={() => setSundaySheetOpen(false)} className="p-1 text-ink-3 hover:text-ink transition-colors" style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-ink-2 mb-2">Service times</p>
                {sundayServices.length > 0 ? (
                  <div className="space-y-1.5">
                    {sundayServices.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-12" style={{ background: 'var(--background)' }}>
                        <div>
                          <p className="text-sm font-medium text-ink">{formatServiceTime(s.startTime)} – {formatServiceTime(s.endTime)}</p>
                          <p className="text-xs text-ink-3">{s.name}</p>
                        </div>
                        <p className="text-xs font-medium" style={{ color: 'var(--brand-teal-text)' }}>Send by {formatServiceTime(addMinutes(s.endTime, 30))}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-ink-3">No services scheduled.</p>}
              </div>
              <div>
                <p className="text-xs font-medium text-ink-2 mb-2">Expected returning guests</p>
                <div className="space-y-1">
                  {tasks.filter((t) => t.status === 'returning').map((t) => (
                    <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--background)' }}>
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-[10px] font-semibold shrink-0`}>{t.guestInitials}</div>
                      <p className="text-sm text-ink">{t.guestName}</p>
                    </div>
                  ))}
                  {tasks.filter((t) => t.status === 'returning').length === 0 && <p className="text-sm text-ink-3">None confirmed yet.</p>}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-ink-2 mb-2">Greeter checklist</p>
                <div className="space-y-1.5">
                  {['Print name tags', 'Prepare welcome table', 'Brief greeters on returning guests', 'Set up connection cards'].map((item) => (
                    <label key={item} className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-bg transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded accent-teal" />
                      <span className="text-sm text-ink-2">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ModePill({ mode }: { mode: string | null }) {
  if (mode === 'live') {
    return (
      <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background: 'var(--success-tint)', color: 'var(--success)' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
        Live
      </span>
    );
  }
  if (mode === 'shadow') {
    return (
      <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background: 'var(--warning-tint)', color: 'var(--warning)' }}>
        <Eye className="w-3 h-3" />
        Shadow
      </span>
    );
  }
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--background)', color: 'var(--text-muted)' }}>
      Setup
    </span>
  );
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.482a23.848 23.848 0 005.454-1.31.75.75 0 00.45-1.05A3.742 3.742 0 0121 12.75V9A6 6 0 009 9v3.75a3.746 3.746 0 01-.763 2.422.75.75 0 00.45 1.05 23.81 23.81 0 005.454 1.31M14.857 17.482a3 3 0 11-5.714 0" />
    </svg>
  );
}

function CountdownPill({ openedAt, now, nowMin }: { openedAt: string; now: number; nowMin: number }) {
  const elapsed = now - new Date(openedAt).getTime();
  const remaining = 15 * 60 * 1000 - elapsed;
  const isOverdue = remaining <= 0;
  const isCritical = !isOverdue && remaining < 5 * 60 * 1000;
  const color = isOverdue ? 'var(--danger)' : isCritical ? 'var(--danger)' : 'var(--warning)';
  const bg = isOverdue ? 'var(--danger-tint)' : isCritical ? 'var(--danger-tint)' : 'var(--warning-tint)';

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full"
      style={{ background: bg, color }}
      aria-live="polite"
    >
      <Clock className="w-4 h-4" />
      <span className="text-sm font-bold tabular-nums">
        {isOverdue ? 'Overdue' : `Reply within ${formatCountdown(remaining)}`}
      </span>
      <span className="sr-only">{isOverdue ? 'Overdue' : `Reply within ${formatCountdownMin(nowMin - new Date(openedAt).getTime() > 0 ? remaining : 0)}`}</span>
    </div>
  );
}

function RailCard({ title, icon: Icon, children }: { title: string; icon?: typeof Activity; children: React.ReactNode }) {
  return (
    <div className="rounded-20 bg-surface p-4" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4 text-ink-3" />}
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ShortcutTile({ icon: Icon, label, onClick }: { icon: typeof Users; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-20 bg-surface transition-colors hover:bg-bg text-left"
      style={{ border: '1px solid var(--border)', minHeight: '64px' }}
    >
      <Icon className="w-5 h-5 shrink-0" style={{ color: 'var(--brand-teal)' }} />
      <span className="text-sm font-medium text-ink flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-ink-3 shrink-0" />
    </button>
  );
}
