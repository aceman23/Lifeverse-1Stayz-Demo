import { BarChart2 } from 'lucide-react';

export function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Insights</h1>
        <p className="text-sm text-stone-400 mt-1">Analytics and reporting for your visitor engagement.</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center">
          <BarChart2 className="w-7 h-7 text-stone-500" strokeWidth={1.5} />
        </div>
        <p className="text-stone-500 font-medium">Insights dashboard coming soon</p>
        <p className="text-sm text-stone-400 max-w-xs text-center">
          Track retention rates, response times, follow-up effectiveness, and congregation growth trends.
        </p>
      </div>
    </div>
  );
}
