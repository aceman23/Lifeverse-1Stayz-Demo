import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../lib/onboarding-context';
import { todayTasks as initialTasks, todayLeaders, pilotHealth, agentActivity, escalations as initialEscalations, type TodayTask, type TodayLeader, type Escalation } from '../data/today';
import { AlertTriangle, Clock, Check, ChevronRight, Zap, Eye, Activity, Calendar, MessageSquare, Phone, UserPlus, BellOff, Undo, Send, Edit3, Trash2 } from 'lucide-react';
import { SpecMarker } from '../components/ui/SpecMarker';

type LeaderTab = 'replied' | 'needs-followup' | 'returning' | 'at-risk';

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Overdue';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatServiceTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const dh = h % 12 || 12;
  return `${dh}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function TodayPage() {
  const navigate = useNavigate();
  const { state } = useOnboarding();
  const mode = state.mode;
  const [leaderTab, setLeaderTab] = useState<LeaderTab>('needs-followup');
  const [showToast, setShowToast] = useState(false);
  const [tasks, setTasks] = useState<TodayTask[]>(initialTasks);
  const [escalationList, setEscalationList] = useState<Escalation[]>(initialEscalations);
  const [now, setNow] = useState(Date.now());
  const [assignOpenFor, setAssignOpenFor] = useState<string | null>(null);
  const [snoozeOpenFor, setSnoozeOpenFor] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
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

  const modePill = mode === 'live'
    ? { label: 'Live', className: 'bg-emerald-100 text-emerald-700' }
    : mode === 'shadow'
      ? { label: 'Shadow mode', className: 'bg-amber-100 text-amber-700' }
      : { label: 'Setup incomplete', className: 'bg-stone-100 text-stone-500' };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const yourName = state.church.yourName || 'Pastor Ray';

  const approvalTasks = mode === 'shadow' ? tasks.filter((t) => t.status === 'approval') : [];
  const followUpTasks = tasks.filter((t) => t.status === 'follow-up');
  const riskTasks = tasks.filter((t) => t.status === 'risk');
  const returningTasks = tasks.filter((t) => t.status === 'returning');
  const prepTasks = tasks.filter((t) => t.status === 'prep');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  const filteredLeaders = todayLeaders.filter((l) => l.status === leaderTab);

  function updateTaskStatus(id: string, status: TodayTask['status']) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function handleReplyInThread() {
    navigate('/conversations');
  }

  function handleSnooze(id: string) {
    setSnoozeOpenFor(null);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleAssign(escalationId: string) {
    setAssignOpenFor(null);
    setEscalationList((prev) => prev.filter((e) => e.id !== escalationId));
  }

  function handleApprove(taskId: string) {
    updateTaskStatus(taskId, 'done');
  }

  function handleDiscard(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function handleUndo(taskId: string, prevStatus: TodayTask['status']) {
    updateTaskStatus(taskId, prevStatus);
  }

  const staffMembers = state.staff;
  const sundayServices = state.serviceSchedule.length > 0 ? state.serviceSchedule : [];

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 md:px-6 pt-20 pb-10">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1a2e2a] text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-[#2ec27e]" />
          {mode === 'live' ? 'Welcome to Live mode — messages send automatically.' : 'Welcome to Shadow mode — review every message before it sends.'}
        </div>
      )}

      <SpecMarker id="today.header">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">{greeting}, {yourName}</h1>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${modePill.className}`}>{modePill.label}</span>
        </div>
        <p className="text-sm text-stone-400 mt-1">Here's what needs your attention today.</p>
      </div>
      </SpecMarker>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {escalationList.length > 0 && (
            <SpecMarker id="today.urgent">
            <div className="space-y-3">
              {escalationList.map((esc) => {
                const elapsed = now - new Date(esc.openedAt).getTime();
                const remaining = 15 * 60 * 1000 - elapsed;
                const isOverdue = remaining <= 0;
                const isCritical = !isOverdue && remaining < 5 * 60 * 1000;
                return (
                  <div key={esc.id} className={`rounded-2xl border p-4 ${isOverdue ? 'bg-rose-100 border-rose-300' : isCritical ? 'bg-rose-50 border-rose-300' : 'bg-rose-50 border-rose-200'}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-rose-800">Urgent escalation — 15 min response</p>
                        <p className="text-xs text-rose-600 mt-0.5">{esc.guestName} — {esc.reason}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button onClick={handleReplyInThread} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors">
                            <MessageSquare className="w-3.5 h-3.5" />Reply in thread
                          </button>
                          <div className="relative">
                            <button onClick={() => setAssignOpenFor(assignOpenFor === esc.id ? null : esc.id)} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors">
                              <UserPlus className="w-3.5 h-3.5" />Assign to…
                            </button>
                            {assignOpenFor === esc.id && (
                              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-stone-200 rounded-xl shadow-lg z-30 overflow-hidden">
                                {staffMembers.map((s) => (
                                  <button key={s.id} onClick={() => handleAssign(esc.id)} className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-semibold text-stone-600 shrink-0">{s.name.split(' ').map((n) => n[0]).join('')}</div>
                                    <div><p className="font-medium">{s.name}</p><p className="text-[10px] text-stone-400">{s.role}</p></div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] text-rose-500 mt-2 italic">The assistant has paused this conversation until a staff member releases it.</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Clock className={`w-4 h-4 ${isOverdue ? 'text-rose-800' : isCritical ? 'text-rose-700' : 'text-rose-600'}`} />
                        <span className={`text-sm font-bold tabular-nums ${isOverdue ? 'text-rose-800' : isCritical ? 'text-rose-700' : 'text-rose-600'}`}>{formatCountdown(remaining)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </SpecMarker>
          )}

          {approvalTasks.length > 0 && (
            <TaskSection title="Needs your approval" icon={Eye} iconColor="text-amber-600" iconBg="bg-amber-50" tasks={approvalTasks} accent="amber" onApprove={handleApprove} onDiscard={handleDiscard} onReply={handleReplyInThread} />
          )}
          {followUpTasks.length > 0 && (
            <TaskSection title="Follow up today" icon={Clock} iconColor="text-blue-600" iconBg="bg-blue-50" tasks={followUpTasks} accent="blue" onReply={handleReplyInThread} onSnooze={handleSnooze} snoozeOpenFor={snoozeOpenFor} setSnoozeOpenFor={setSnoozeOpenFor} onDone={updateTaskStatus} />
          )}
          {riskTasks.length > 0 && (
            <TaskSection title="At risk" icon={AlertTriangle} iconColor="text-rose-600" iconBg="bg-rose-50" tasks={riskTasks} accent="rose" onReply={handleReplyInThread} onSnooze={handleSnooze} snoozeOpenFor={snoozeOpenFor} setSnoozeOpenFor={setSnoozeOpenFor} onDone={updateTaskStatus} />
          )}
          {returningTasks.length > 0 && (
            <TaskSection title="Coming back this Sunday" icon={Calendar} iconColor="text-emerald-600" iconBg="bg-emerald-50" tasks={returningTasks} accent="emerald" onReply={handleReplyInThread} onSnooze={handleSnooze} snoozeOpenFor={snoozeOpenFor} setSnoozeOpenFor={setSnoozeOpenFor} onDone={updateTaskStatus} />
          )}
          {prepTasks.length > 0 && (
            <TaskSection title="Sunday prep" icon={Zap} iconColor="text-stone-600" iconBg="bg-stone-100" tasks={prepTasks} accent="stone" onReply={handleReplyInThread} onSnooze={handleSnooze} snoozeOpenFor={snoozeOpenFor} setSnoozeOpenFor={setSnoozeOpenFor} onDone={updateTaskStatus} />
          )}
          {doneTasks.length > 0 && (
            <TaskSection title="Done today" icon={Check} iconColor="text-emerald-600" iconBg="bg-emerald-50" tasks={doneTasks} accent="emerald" onUndo={handleUndo} />
          )}

          <SpecMarker id="today.leaders">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-50"><h3 className="text-sm font-semibold text-stone-800">Leader list</h3></div>
            <div className="flex items-center gap-1 px-4 py-2 border-b border-stone-50 overflow-x-auto">
              {([
                { key: 'replied' as const, label: 'Replied' },
                { key: 'needs-followup' as const, label: 'Needs follow-up' },
                { key: 'returning' as const, label: 'Coming back' },
                { key: 'at-risk' as const, label: 'At risk' },
              ]).map((tab) => (
                <button key={tab.key} onClick={() => setLeaderTab(tab.key)} className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${leaderTab === tab.key ? 'bg-[#1a2e2a] text-white' : 'text-stone-500 hover:bg-stone-50'}`}>{tab.label}</button>
              ))}
            </div>
            <div>
              {filteredLeaders.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-stone-400">No guests in this category.</div>
              ) : filteredLeaders.map((leader) => <LeaderRow key={leader.id} leader={leader} />)}
            </div>
          </div>
          </SpecMarker>
        </div>

        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <SpecMarker id="today.pilot_health">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-stone-800 mb-3">Pilot health vs targets</h3>
            <div className="space-y-2.5">
              {pilotHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-stone-700">{item.label}</p>
                    <p className="text-[10px] text-stone-400">Target: {item.target}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold ${item.onTrack ? 'text-emerald-600' : 'text-amber-600'}`}>{item.current}</span>
                    <div className={`w-2 h-2 rounded-full ${item.onTrack ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </SpecMarker>

          <SpecMarker id="today.agent_activity">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-800">Agent activity</h3>
            </div>
            <div className="space-y-2">
              {agentActivity.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-[10px] text-stone-400 tabular-nums shrink-0 mt-0.5">{item.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-700 truncate">{item.action}</p>
                    <p className="text-[10px] text-stone-400 truncate">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </SpecMarker>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-800">This Sunday</h3>
            </div>
            {sundayServices.length > 0 ? (
              <div className="space-y-2">
                {sundayServices.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-stone-50/50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-stone-700">{formatServiceTime(s.startTime)}</p>
                      <p className="text-[10px] text-stone-400">{s.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-stone-400">Send by</p>
                      <p className="text-[10px] text-[#2ec27e] font-medium">{formatServiceTime(addMinutes(s.endTime, 30))}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400">No services scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

interface TaskSectionProps {
  title: string;
  icon: typeof Clock;
  iconColor: string;
  iconBg: string;
  tasks: TodayTask[];
  accent: string;
  onApprove?: (id: string) => void;
  onDiscard?: (id: string) => void;
  onReply?: () => void;
  onSnooze?: (id: string) => void;
  snoozeOpenFor?: string | null;
  setSnoozeOpenFor?: (id: string | null) => void;
  onDone?: (id: string, status: TodayTask['status']) => void;
  onUndo?: (id: string, prevStatus: TodayTask['status']) => void;
}

function TaskSection({ title, icon: Icon, iconColor, iconBg, tasks, accent, onApprove, onDiscard, onReply, onSnooze, snoozeOpenFor, setSnoozeOpenFor, onDone, onUndo }: TaskSectionProps) {
  const accentColors: Record<string, string> = {
    amber: 'border-l-amber-400', blue: 'border-l-blue-400', rose: 'border-l-rose-400',
    emerald: 'border-l-emerald-400', stone: 'border-l-stone-300',
  };
  const isApproval = title === 'Needs your approval';
  const isDone = title === 'Done today';

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-50">
        <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
        <span className="text-xs text-stone-400 ml-auto">{tasks.length}</span>
      </div>
      <div>
        {tasks.map((task) => (
          <div key={task.id} className={`border-l-2 ${accentColors[accent]} border-b border-stone-50 last:border-0`}>
            <div className="flex items-start gap-3 px-4 py-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${task.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>{task.guestInitials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">{task.title}</p>
                <p className="text-xs text-stone-400">{task.detail}</p>
                {isApproval && task.draftMessage && (
                  <div className="mt-2 bg-stone-50 rounded-lg p-2.5">
                    <p className="text-xs text-stone-500 leading-relaxed">{task.draftMessage}</p>
                  </div>
                )}
              </div>
              {task.channel && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 shrink-0">{task.channel}</span>}
              <span className="text-[10px] text-stone-400 tabular-nums shrink-0">{task.time}</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 pb-2.5 flex-wrap">
              {isApproval ? (
                <>
                  {onApprove && <button onClick={() => onApprove(task.id)} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"><Send className="w-3 h-3" />Approve & send</button>}
                  <button className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"><Edit3 className="w-3 h-3" />Edit</button>
                  {onDiscard && <button onClick={() => onDiscard(task.id)} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 className="w-3 h-3" />Discard</button>}
                </>
              ) : isDone ? (
                <>
                  {onUndo && <button onClick={() => onUndo(task.id, 'follow-up')} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"><Undo className="w-3 h-3" />Undo</button>}
                </>
              ) : (
                <>
                  {onReply && <button onClick={onReply} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"><MessageSquare className="w-3 h-3" />Reply in thread</button>}
                  <button className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"><Phone className="w-3 h-3" />Call</button>
                  <button className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"><UserPlus className="w-3 h-3" />Assign</button>
                  {onSnooze && setSnoozeOpenFor && (
                    <div className="relative">
                      <button onClick={() => setSnoozeOpenFor(snoozeOpenFor === task.id ? null : task.id)} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 transition-colors"><BellOff className="w-3 h-3" />Snooze</button>
                      {snoozeOpenFor === task.id && (
                        <div className="absolute bottom-full left-0 mb-1 w-36 bg-white border border-stone-200 rounded-xl shadow-lg z-30 overflow-hidden">
                          <button onClick={() => onSnooze(task.id)} className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors">1 day</button>
                          <button onClick={() => onSnooze(task.id)} className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors">3 days</button>
                          <button onClick={() => onSnooze(task.id)} className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors">Next week</button>
                        </div>
                      )}
                    </div>
                  )}
                  {onDone && <button onClick={() => onDone(task.id, 'done')} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"><Check className="w-3 h-3" />Done</button>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderRow({ leader }: { leader: TodayLeader }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    'replied': { label: 'Replied', color: 'bg-emerald-50 text-emerald-600' },
    'needs-followup': { label: 'Needs follow-up', color: 'bg-amber-50 text-amber-600' },
    'returning': { label: 'Coming back', color: 'bg-blue-50 text-blue-600' },
    'at-risk': { label: 'At risk', color: 'bg-rose-50 text-rose-600' },
  };
  const cfg = statusConfig[leader.status];
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors group border-b border-stone-50 last:border-0 text-left">
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${leader.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>{leader.initials}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-stone-800 truncate">{leader.name}</p>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cfg.color} shrink-0`}>{cfg.label}</span>
        </div>
        <p className="text-xs text-stone-400 truncate mt-0.5">"{leader.lastMessage}"</p>
      </div>
      <span className="text-[10px] text-stone-400 shrink-0">{leader.time}</span>
      <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-400 transition-colors shrink-0" />
    </button>
  );
}
