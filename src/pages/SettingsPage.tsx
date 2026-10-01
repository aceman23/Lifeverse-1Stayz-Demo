import { useState, useEffect, useCallback } from 'react';
import { Download, Loader2, RefreshCw, Building2, Calendar, Shield, Users, MessageSquare, Plug, ToggleRight, Lock, Plus, X } from 'lucide-react';
import type { BetaSignup } from '../lib/types';
import type { OnboardingState } from '../data/onboarding';
import { LOCKED_RULES } from '../data/onboarding';
import { Step1Church } from '../components/onboarding/Step1Church';
import { Step2Reading } from '../components/onboarding/Step2Reading';
import { Step5Guardrails } from '../components/onboarding/Step5Guardrails';
import { Step6Team } from '../components/onboarding/Step6Team';
import { Step7Message } from '../components/onboarding/Step7Message';
import { Step4Systems } from '../components/onboarding/Step4Systems';
import { useOnboarding } from '../lib/onboarding-context';
import { SpecMarker } from '../components/ui/SpecMarker';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-beta-signups`;

const TABS = [
  { key: 'church', label: 'Church Profile', icon: Building2 },
  { key: 'schedule', label: 'Service Schedule', icon: Calendar },
  { key: 'guardrails', label: 'Guardrails', icon: Shield },
  { key: 'team', label: 'Team & Escalations', icon: Users },
  { key: 'message', label: 'First Message', icon: MessageSquare },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'mode', label: 'Mode', icon: ToggleRight },
] as const;

type TabKey = typeof TABS[number]['key'];

export function SettingsPage() {
  const { state, update } = useOnboarding();
  const [activeTab, setActiveTab] = useState<TabKey>('church');
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(FUNCTION_URL, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      setSignups(json as BetaSignup[]);
    } catch (err) {
      setFetchError(String(err));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function downloadCSV() {
    const headers = ['Name', 'Email', 'Church', 'Role', 'Phone', 'Church Size', 'Notes', 'Signed Up'];
    const rows = signups.map(s => [
      s.name, s.email, s.church, s.role, s.phone, s.church_size, s.notes,
      new Date(s.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beta-signups-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-4 md:px-6 pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <p className="text-sm text-stone-400 mt-1">Configure your 1Stayz workspace and integrations.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-stone-900 border border-stone-100 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <SpecMarker id="settings.tabs">
      <div className="max-w-[720px]">
        {activeTab === 'church' && <Step1Church />}
        {activeTab === 'schedule' && <Step2Reading />}
        {activeTab === 'guardrails' && (
          <div className="space-y-6">
            <Step5Guardrails />
            <LockedRulesCard />
          </div>
        )}
        {activeTab === 'team' && <Step6Team />}
        {activeTab === 'message' && <Step7Message />}
        {activeTab === 'integrations' && <Step4Systems />}
        {activeTab === 'mode' && (
          <ModeTab state={state} update={update} />
        )}
      </div>
      </SpecMarker>

      {/* Beta Signups Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mt-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-semibold text-stone-800">Pilot Signups</h2>
            <p className="text-xs text-stone-400 mt-0.5">{loading ? '...' : `${signups.length} total signups`}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-1.5 border border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300 text-sm font-medium px-3 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={downloadCSV}
              disabled={loading || signups.length === 0}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white text-sm font-medium px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
        {fetchError && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-xs text-red-600">{fetchError}</div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-stone-300 animate-spin" />
          </div>
        ) : signups.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-stone-400">No pilot signups yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left">
                  <th className="px-5 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="px-5 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Church</th>
                  <th className="px-5 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Phone</th>
                  <th className="px-5 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {signups.map(s => (
                  <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-stone-800 whitespace-nowrap">{s.name}</td>
                    <td className="px-5 py-3 text-stone-600 whitespace-nowrap">{s.email}</td>
                    <td className="px-5 py-3 text-stone-600 whitespace-nowrap">{s.church || '—'}</td>
                    <td className="px-5 py-3 text-stone-600 whitespace-nowrap">{s.role || '—'}</td>
                    <td className="px-5 py-3 text-stone-600 whitespace-nowrap">{s.phone || '—'}</td>
                    <td className="px-5 py-3 text-stone-400 whitespace-nowrap">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function LockedRulesCard() {
  const [rules, setRules] = useState<string[]>([...LOCKED_RULES]);
  const [newRule, setNewRule] = useState('');

  function addRule() {
    const trimmed = newRule.trim();
    if (!trimmed || rules.includes(trimmed)) return;
    setRules((prev) => [...prev, trimmed]);
    setNewRule('');
  }

  function removeRule(rule: string) {
    setRules((prev) => prev.filter((r) => r !== rule));
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Lock className="w-4 h-4 text-stone-400" />
        <h3 className="text-sm font-semibold text-stone-800">Locked Rules</h3>
      </div>
      <p className="text-xs text-stone-400 mb-4">These rules are always enforced by the assistant. Add or remove rules here.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {rules.map((rule) => (
          <span
            key={rule}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 group"
          >
            <Lock className="w-3 h-3 text-stone-400 shrink-0" />
            {rule}
            <button
              onClick={() => removeRule(rule)}
              className="ml-0.5 text-stone-300 hover:text-rose-500 transition-colors"
              aria-label={`Remove rule: ${rule}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {rules.length === 0 && (
          <p className="text-xs text-stone-400 italic">No locked rules — add one below.</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addRule()}
          placeholder="Add a new rule…"
          className="flex-1 text-sm border border-stone-200 rounded-lg px-3.5 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
        />
        <button
          onClick={addRule}
          disabled={!newRule.trim()}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-[#1a2e2a] text-white hover:bg-[#245045] disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}

function ModeTab({ state, update }: { state: OnboardingState; update: (patch: Partial<OnboardingState>) => void }) {
  const checks = [
    { key: 'church', label: 'Church profile reviewed', ok: state.church.name.trim() !== '' && state.church.yourName.trim() !== '' && state.church.yourRole !== '' },
    { key: 'schedule', label: 'Service schedule set', ok: state.serviceSchedule.length > 0 && state.serviceSchedule.every((s) => s.name.trim() !== '' && s.startTime < s.endTime) },
    { key: 'subsplash', label: 'Subsplash connected', ok: state.integrations.subsplash !== 'none' },
    { key: 'guardrails', label: 'Guardrails approved by pastor', ok: !!state.guardrailsApprovedBy },
    { key: 'team', label: 'Team & escalation contacts set', ok: state.staff.length > 0 && state.staff.some((s) => s.receivesEscalations) },
    { key: 'message', label: 'First message approved by pastor', ok: state.firstMessageStatus === 'approved' },
    { key: 'consent', label: 'Consent wording live on connection card', ok: state.integrations.consentWordingLive },
    { key: 'sms', label: 'Text number approved OR email-first fallback acknowledged', ok: state.integrations.smsStatus === 'approved' || state.integrations.emailFallbackAcknowledged },
    { key: 'shadow', label: 'Shadow Sunday completed', ok: state.integrations.shadowSundayCompleted },
  ];

  const allGreen = checks.every((c) => c.ok);
  const missing = checks.filter((c) => !c.ok);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Mode</h2>
        <p className="text-sm text-stone-500 mt-1">Switch between Shadow and Live mode.</p>
      </div>

      {!allGreen && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-medium text-amber-800 mb-2">Live mode is not ready yet</p>
          <p className="text-xs text-amber-700 mb-3">Complete these items before going live:</p>
          <ul className="space-y-1.5">
            {missing.map((c) => (
              <li key={c.key} className="text-xs text-amber-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shadow Sunday toggle */}
      <div className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-800">Shadow Sunday completed</p>
          <p className="text-xs text-stone-400 mt-0.5">Mark this after running a full Sunday in shadow mode.</p>
        </div>
        <button
          onClick={() => update({ integrations: { ...state.integrations, shadowSundayCompleted: !state.integrations.shadowSundayCompleted } })}
          className={`relative w-11 h-6 rounded-full transition-colors ${state.integrations.shadowSundayCompleted ? 'bg-emerald-500' : 'bg-stone-200'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.integrations.shadowSundayCompleted ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => update({ mode: 'shadow' })}
          className={`text-left p-5 rounded-2xl border transition-all ${
            state.mode === 'shadow'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-stone-100 hover:border-stone-200'
          }`}
        >
          <p className="text-sm font-semibold text-stone-900 mb-1">Shadow Mode</p>
          <p className="text-xs text-stone-400">1Stayz writes every message but holds it for your approval.</p>
        </button>
        <button
          onClick={() => allGreen && update({ mode: 'live' })}
          disabled={!allGreen}
          className={`text-left p-5 rounded-2xl border transition-all ${
            state.mode === 'live'
              ? 'bg-emerald-50 border-emerald-200'
              : allGreen
                ? 'bg-white border-stone-100 hover:border-stone-200'
                : 'bg-stone-50 border-stone-100 opacity-60 cursor-not-allowed'
          }`}
        >
          <p className="text-sm font-semibold text-stone-900 mb-1">Live Mode</p>
          <p className="text-xs text-stone-400">1Stayz sends messages automatically.</p>
          {!allGreen && <p className="text-[10px] text-amber-600 mt-2">Complete all checks to enable</p>}
        </button>
      </div>
    </div>
  );
}
