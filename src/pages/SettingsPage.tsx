import { useState, useEffect, useCallback } from 'react';
import { Settings, Download, Loader2, RefreshCw } from 'lucide-react';
import type { BetaSignup } from '../lib/types';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-beta-signups`;

export function SettingsPage() {
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
      s.name,
      s.email,
      s.church,
      s.role,
      s.phone,
      s.church_size,
      s.notes,
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
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <p className="text-sm text-stone-400 mt-1">Configure your 1Stayz workspace and integrations.</p>
      </div>

      {/* Beta Signups Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-6">
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
                  <th className="px-5 py-3 font-medium text-stone-500 text-xs uppercase tracking-wide">Size</th>
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
                    <td className="px-5 py-3 text-stone-600 whitespace-nowrap">{s.church_size || '—'}</td>
                    <td className="px-5 py-3 text-stone-400 whitespace-nowrap">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Placeholder for future settings */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center">
          <Settings className="w-7 h-7 text-stone-500" strokeWidth={1.5} />
        </div>
        <p className="text-stone-500 font-medium">More settings coming soon</p>
        <p className="text-sm text-stone-400 max-w-xs text-center">
          Manage church profile, team members, notification preferences, and API integrations.
        </p>
      </div>
    </div>
  );
}
