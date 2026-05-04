import { Video as LucideIcon, TrendingUp } from 'lucide-react';

interface SourceCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  trend: string;
  color: string;
  bgColor: string;
  status: 'active' | 'paused';
  lastSync: string;
}

export function SourceCard({ icon: Icon, label, count, trend, color, bgColor, status, lastSync }: SourceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.75} />
        </div>
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
          status === 'active'
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-stone-100 text-stone-500'
        }`}>
          {status === 'active' ? 'Live' : 'Paused'}
        </span>
      </div>
      <p className="text-2xl font-semibold text-stone-900">{count}</p>
      <p className="text-sm text-stone-500 mt-0.5">{label}</p>
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-50">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-xs text-emerald-600 font-medium">{trend}</span>
        <span className="text-xs text-stone-400 ml-auto">Synced {lastSync}</span>
      </div>
    </div>
  );
}
