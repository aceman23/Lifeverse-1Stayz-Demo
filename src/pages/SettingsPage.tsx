import { useState, useEffect, useCallback } from 'react';
import { Download, Loader2, RefreshCw, Building2, Calendar, Shield, Users, MessageSquare, Plug, ToggleRight } from 'lucide-react';
import type { BetaSignup } from '../lib/types';
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
        {activeTab === 'guardrails' && <Step5Guardrails />}
        {activeTab === 'team' && <Step6Team />}
        {activeTab === 'message' && <Step7Message />}
        {activeTab === 'integrations' && <Step4Systems />}
        {activeTab === 'mode' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">Mode</h2>
              <p className="text-sm text-stone-500 mt-1">Switch between Shadow and Live mode.</p>
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
                onClick={() => update({ mode: 'live' })}
                className={`text-left p-5 rounded-2xl border transition-all ${
                  state.mode === 'live'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-stone-100 hover:border-stone-200'
                }`}
              >
                <p className="text-sm font-semibold text-stone-900 mb-1">Live Mode</p>
                <p className="text-xs text-stone-400">1Stayz sends messages automatically.</p>
              </button>
            </div>
          </div>
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
