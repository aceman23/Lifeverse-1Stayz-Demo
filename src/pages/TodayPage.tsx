import { useState, useEffect } from 'react';
import { useOnboarding } from '../lib/onboarding-context';
import { todayTasks, todayLeaders, pilotHealth, agentActivity, thisSunday, type TodayTask, type TodayLeader } from '../data/today';
import { AlertTriangle, Clock, Check, ChevronRight, Zap, Eye, Activity, Calendar } from 'lucide-react';
import { SpecMarker } from '../components/ui/SpecMarker';

type LeaderTab = 'replied' | 'needs-followup' | 'returning' | 'at-risk';

export function TodayPage() {
  const { state } = useOnboarding();
  const mode = state.mode;
  const [leaderTab, setLeaderTab] = useState<LeaderTab>('needs-followup');
  const [showToast, setShowToast] = useState(false);

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

  const approvalTasks = mode === 'shadow' ? todayTasks.filter((t) => t.status === 'approval') : [];
  const followUpTasks = todayTasks.filter((t) => t.status === 'follow-up');
  const riskTasks = todayTasks.filter((t) => t.status === 'risk');
  const returningTasks = todayTasks.filter((t) => t.status === 'returning');
  const prepTasks = todayTasks.filter((t) => t.status === 'prep');
  const doneTasks = todayTasks.filter((t) => t.status === 'done');

  const filteredLeaders = todayLeaders.filter((l) => l.status === leaderTab);
  const urgentCount = todayTasks.filter((t) => t.priority === 'urgent').length;

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 md:px-6 pt-20 pb-10">
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1a2e2a] text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-[#2ec27e]" />
          Welcome to Shadow mode — review every message before it sends.
        </div>
      )}

      <SpecMarker id="today.header">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">{greeting}, Pastor Ray</h1>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${modePill.className}`}>{modePill.label}</span>
        </div>
        <p className="text-sm text-stone-400 mt-1">Here's what needs your attention today.</p>
      </div>
      </SpecMarker>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {urgentCount > 0 && (
            <SpecMarker id="today.urgent">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-800">Urgent escalation — 15 min response</p>
                <p className="text-xs text-rose-600 mt-0.5">Sarah Johnson shared a concern. A pastor needs to reply within 15 min.</p>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 shrink-0">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-bold tabular-nums">14:58</span>
              </div>
            </div>
            </SpecMarker>
          )}

          {approvalTasks.length > 0 && (
            <TaskSection title="Needs your approval" icon={Eye} iconColor="text-amber-600" iconBg="bg-amber-50" tasks={approvalTasks} accent="amber" />
          )}
          {followUpTasks.length > 0 && (
            <TaskSection title="Follow up today" icon={Clock} iconColor="text-blue-600" iconBg="bg-blue-50" tasks={followUpTasks} accent="blue" />
          )}
          {riskTasks.length > 0 && (
            <TaskSection title="At risk" icon={AlertTriangle} iconColor="text-rose-600" iconBg="bg-rose-50" tasks={riskTasks} accent="rose" />
          )}
          {returningTasks.length > 0 && (
            <TaskSection title="Coming back this Sunday" icon={Calendar} iconColor="text-emerald-600" iconBg="bg-emerald-50" tasks={returningTasks} accent="emerald" />
          )}
          {prepTasks.length > 0 && (
            <TaskSection title="Sunday prep" icon={Zap} iconColor="text-stone-600" iconBg="bg-stone-100" tasks={prepTasks} accent="stone" />
          )}
          {doneTasks.length > 0 && (
            <TaskSection title="Done today" icon={Check} iconColor="text-emerald-600" iconBg="bg-emerald-50" tasks={doneTasks} accent="emerald" />
          )}

          <SpecMarker id="today.leaders">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-50">
              <h3 className="text-sm font-semibold text-stone-800">Leader list</h3>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 border-b border-stone-50 overflow-x-auto">
              {([
                { key: 'replied' as const, label: 'Replied' },
                { key: 'needs-followup' as const, label: 'Needs follow-up' },
                { key: 'returning' as const, label: 'Coming back' },
                { key: 'at-risk' as const, label: 'At risk' },
              ]).map((tab) => (
                <button key={tab.key} onClick={() => setLeaderTab(tab.key)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${leaderTab === tab.key ? 'bg-[#1a2e2a] text-white' : 'text-stone-500 hover:bg-stone-50'}`}>
                  {tab.label}
                </button>
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
            <div className="space-y-2">
              {thisSunday.map((s) => (
                <div key={s.service} className="flex items-center justify-between p-2 bg-stone-50/50 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-stone-700">{s.time}</p>
                    <p className="text-[10px] text-stone-400">{s.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-stone-700">{s.expected} expected</p>
                    <p className="text-[10px] text-[#2ec27e]">{s.firstTime} first-time</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskSection({ title, icon: Icon, iconColor, iconBg, tasks, accent }: {
  title: string; icon: typeof Clock; iconColor: string; iconBg: string; tasks: TodayTask[]; accent: string;
}) {
  const accentColors: Record<string, string> = {
    amber: 'border-l-amber-400', blue: 'border-l-blue-400', rose: 'border-l-rose-400',
    emerald: 'border-l-emerald-400', stone: 'border-l-stone-300',
  };
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
          <button key={task.id} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors group border-l-2 ${accentColors[accent]} border-b border-stone-50 last:border-0 text-left`}>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${task.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>{task.guestInitials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">{task.title}</p>
              <p className="text-xs text-stone-400 truncate">{task.detail}</p>
            </div>
            {task.channel && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 shrink-0">{task.channel}</span>}
            <span className="text-[10px] text-stone-400 tabular-nums shrink-0">{task.time}</span>
            <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-400 transition-colors shrink-0" />
          </button>
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
