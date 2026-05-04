import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Visitor } from '../../lib/types';
import { StatusBadge } from '../ui/StatusBadge';
import { timeAgo } from '../../lib/utils';

interface VisitorPipelinePanelProps {
  visitors: Visitor[];
  loading: boolean;
}

export function VisitorPipelinePanel({ visitors, loading }: VisitorPipelinePanelProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/70 border border-stone-100 rounded-2xl p-5 flex-1 min-w-0">
      <h2 className="text-base font-semibold text-stone-800 mb-4">
        People <span className="font-light text-stone-500">We Saved From Leaving</span>
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-stone-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : visitors.length === 0 ? (
        <p className="text-sm text-stone-400 py-4 text-center">
          No active concerns this week.
        </p>
      ) : (
        <div className="space-y-1">
          {visitors.map((visitor) => (
            <button
              key={visitor.id}
              onClick={() => navigate(`/visitor/${visitor.id}`)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-stone-50 transition-colors group text-left"
            >
              <img
                src={visitor.avatar_url ?? `https://ui-avatars.com/api/?name=${visitor.first_name}+${visitor.last_name}&background=e7e5e4&color=78716c`}
                alt={`${visitor.first_name} ${visitor.last_name}`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-stone-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-800 text-sm">
                    {visitor.first_name} {visitor.last_name}
                  </span>
                  <span className="text-xs text-stone-400 flex-shrink-0">
                    {timeAgo(visitor.updated_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusBadge status={visitor.follow_up_status} />
                  {visitor.notes && (
                    <span className="text-xs text-stone-400 truncate max-w-[160px]">
                      {visitor.notes}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      <button className="w-full mt-3 text-xs text-stone-400 hover:text-stone-600 transition-colors text-center py-1">
        What happened?
      </button>
    </div>
  );
}
