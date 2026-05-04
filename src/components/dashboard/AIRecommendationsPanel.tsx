import { MoreHorizontal, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Visitor } from '../../lib/types';
import { timeAgo } from '../../lib/utils';

interface AIRecommendationsPanelProps {
  visitor: Visitor | null;
  loading: boolean;
}

export function AIRecommendationsPanel({ visitor, loading }: AIRecommendationsPanelProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/70 border border-stone-100 rounded-2xl p-5 w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
          AI Recommendations
        </span>
        <button className="text-stone-300 hover:text-stone-500 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-stone-50 rounded-xl animate-pulse" />
          <div className="h-16 bg-stone-50 rounded-xl animate-pulse" />
          <div className="h-8 bg-stone-50 rounded-xl animate-pulse" />
        </div>
      ) : visitor ? (
        <div>
          <button
            onClick={() => navigate(`/visitor/${visitor.id}`)}
            className="flex items-center gap-2.5 mb-3 w-full text-left hover:opacity-80 transition-opacity"
          >
            <img
              src={visitor.avatar_url ?? `https://ui-avatars.com/api/?name=${visitor.first_name}+${visitor.last_name}&background=e7e5e4&color=78716c`}
              alt={`${visitor.first_name} ${visitor.last_name}`}
              className="w-9 h-9 rounded-full object-cover border border-stone-100"
            />
            <div className="flex-1">
              <div className="font-medium text-stone-800 text-sm">
                {visitor.first_name} {visitor.last_name}
              </div>
            </div>
            <button className="text-stone-300 hover:text-stone-500 transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </button>

          <div className="bg-stone-50/80 rounded-xl p-3.5 mb-3">
            <p className="text-sm text-stone-600 italic leading-relaxed">
              &ldquo;{
                (visitor.ai_memory as Record<string, unknown>)?.mentioned_feeling_unseen
                  ? 'I felt unseen\u2026 I just don\u2019t know if I belong here.'
                  : visitor.notes ?? 'Engaged with our outreach this week.'
              }&rdquo;
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-stone-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Awaiting response</span>
              </div>
              <span className="text-stone-400">{timeAgo(visitor.updated_at)}</span>
            </div>
            <p className="text-xs text-stone-400 italic">
              {visitor.ai_memory && (visitor.ai_memory as Record<string, unknown>).prayer_requests
                ? (visitor.ai_memory as Record<string, unknown[]>).prayer_requests
                    ?.slice(0, 1)
                    .join(', ')
                : 'Strengthen connection...'}
            </p>
          </div>

          <button
            onClick={() => navigate(`/visitor/${visitor.id}`)}
            className="w-full flex items-center justify-between text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Response</span>
            </div>
            <div className="flex items-center gap-1 text-amber-600">
              <span>Pending</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      ) : (
        <div className="text-center py-6">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm text-stone-400">All concerns addressed.</p>
        </div>
      )}
    </div>
  );
}
