import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <p className="text-sm text-stone-400 mt-1">Configure your 1Stayz workspace and integrations.</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center">
          <Settings className="w-7 h-7 text-stone-500" strokeWidth={1.5} />
        </div>
        <p className="text-stone-500 font-medium">Settings panel coming soon</p>
        <p className="text-sm text-stone-400 max-w-xs text-center">
          Manage church profile, team members, notification preferences, and API integrations.
        </p>
      </div>
    </div>
  );
}
