import { ChevronRight } from 'lucide-react';
import type { CommunicationEvent } from '../../lib/types';
import { timeAgo } from '../../lib/utils';

interface ConversationTimelineProps {
  events: CommunicationEvent[];
}

const sentimentColors: Record<string, string> = {
  negative: 'bg-rose-50 border-rose-100 text-rose-800',
  positive: 'bg-emerald-50 border-emerald-100 text-emerald-800',
  supportive: 'bg-sky-50 border-sky-100 text-sky-800',
  empathetic: 'bg-amber-50 border-amber-100 text-amber-800',
  warm: 'bg-orange-50 border-orange-100 text-orange-800',
  relieved: 'bg-teal-50 border-teal-100 text-teal-800',
  neutral: 'bg-stone-50 border-stone-100 text-stone-700',
  inviting: 'bg-blue-50 border-blue-100 text-blue-800',
};

export function ConversationTimeline({ events }: ConversationTimelineProps) {
  if (events.length === 0) return null;

  return (
    <div className="bg-white/60 border border-stone-100 rounded-2xl overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-medium text-stone-700">How we listened</h3>
        <ChevronRight className="w-4 h-4 text-stone-300" />
      </button>
      <div className="border-t border-stone-50 px-5 pb-5 pt-3 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3">
            {event.direction === 'outbound' ? (
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=40"
                alt="AI"
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 border border-stone-100"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-stone-100 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <span className="text-xs font-medium text-stone-500">V</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div
                className={`rounded-xl px-3.5 py-2.5 text-sm border ${
                  sentimentColors[event.sentiment] ?? sentimentColors.neutral
                }`}
              >
                {event.content}
              </div>
              <span className="text-xs text-stone-400 mt-1 block">{timeAgo(event.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
