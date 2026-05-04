import { GitCommitVertical as GitCommit, ChevronRight } from 'lucide-react';

export interface IterationEntry {
  version: string;
  date: string;
  author: string;
  changes: string[];
  category: 'tone' | 'timing' | 'escalation' | 'content' | 'channel';
}

const categoryConfig = {
  tone: { label: 'Tone', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  timing: { label: 'Timing', color: 'bg-sky-50 text-sky-700 border-sky-100' },
  escalation: { label: 'Escalation', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  content: { label: 'Content', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  channel: { label: 'Channel', color: 'bg-violet-50 text-violet-700 border-violet-100' },
};

interface IterationLogProps {
  entries: IterationEntry[];
}

export function IterationLog({ entries }: IterationLogProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-50">
        <h3 className="text-sm font-semibold text-stone-900">Iteration History</h3>
        <p className="text-xs text-stone-400 mt-0.5">Changes made based on pilot feedback</p>
      </div>
      <div className="divide-y divide-stone-50">
        {entries.map((entry) => {
          const cfg = categoryConfig[entry.category];
          return (
            <div key={entry.version} className="px-5 py-4">
              <div className="flex items-center gap-3 mb-2">
                <GitCommit className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-xs font-mono font-semibold text-stone-700">{entry.version}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="ml-auto text-xs text-stone-400">{entry.date}</span>
              </div>
              <p className="text-xs text-stone-400 mb-2 ml-7">by {entry.author}</p>
              <ul className="ml-7 space-y-1">
                {entry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0 mt-0.5" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
