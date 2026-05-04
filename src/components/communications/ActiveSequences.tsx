import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ActiveSequence {
  visitorId: string;
  name: string;
  week: number;
  channel: string;
  nextTouch: string;
  status: 'on_track' | 'overdue' | 'awaiting_reply';
}

const statusConfig = {
  on_track: { label: 'On Track', class: 'bg-emerald-50 text-emerald-700' },
  overdue: { label: 'Overdue', class: 'bg-rose-50 text-rose-700' },
  awaiting_reply: { label: 'Awaiting Reply', class: 'bg-amber-50 text-amber-700' },
};

interface ActiveSequencesProps {
  sequences: ActiveSequence[];
}

export function ActiveSequences({ sequences }: ActiveSequencesProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-50">
        <h3 className="text-sm font-semibold text-stone-900">Active Sequences</h3>
        <p className="text-xs text-stone-400 mt-0.5">{sequences.length} visitors currently in follow-up</p>
      </div>
      <div className="divide-y divide-stone-50">
        {sequences.map((seq) => {
          const cfg = statusConfig[seq.status];
          return (
            <div key={seq.visitorId} className="px-6 py-3 flex items-center gap-3 hover:bg-stone-50/60 transition-colors">
              <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-[11px] font-semibold text-stone-500 shrink-0">
                {seq.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{seq.name}</p>
                <p className="text-xs text-stone-400">Week {seq.week} · Next: {seq.nextTouch}</p>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${cfg.class}`}>
                {cfg.label}
              </span>
              <Link
                to={`/visitor/${seq.visitorId}`}
                className="text-stone-400 hover:text-amber-600 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
