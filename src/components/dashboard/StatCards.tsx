import { ChevronRight } from 'lucide-react';
import type { DashboardStats } from '../../lib/types';

interface StatCardsProps {
  stats: DashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white/70 border border-stone-100 rounded-xl px-5 py-4 hover:bg-white/90 transition-colors cursor-pointer group">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light text-stone-800">{stats.newVisitorsThisWeek}</span>
          <span className="text-sm text-stone-500">new people last Sunday</span>
        </div>
      </div>

      <div className="bg-white/70 border border-stone-100 rounded-xl px-5 py-4 hover:bg-white/90 transition-colors cursor-pointer group">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light text-stone-800">{stats.inConversation}</span>
          <span className="text-sm text-stone-500">are already in conversation</span>
        </div>
      </div>

      <div className="bg-white/70 border border-stone-100 rounded-xl px-5 py-4 hover:bg-white/90 transition-colors cursor-pointer group flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light text-stone-800">{stats.concernsRaised}</span>
          <span className="text-sm text-stone-500 flex items-center gap-1">
            people{' '}
            <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded font-medium">
              STOMD
            </span>
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
      </div>
    </div>
  );
}
