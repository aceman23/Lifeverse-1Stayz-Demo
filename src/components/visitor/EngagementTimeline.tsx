import { Coffee, MessageCircle, Heart, Users, Baby, ChevronRight } from 'lucide-react';
import type { VisitorWithDetails } from '../../lib/types';
import { timeAgo, formatDate } from '../../lib/utils';

interface EngagementTimelineProps {
  visitor: VisitorWithDetails;
}

interface TimelineEntry {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  time: string;
  color: string;
}

export function EngagementTimeline({ visitor }: EngagementTimelineProps) {
  const entries: TimelineEntry[] = [];

  visitor.visit_events?.forEach((ve) => {
    entries.push({
      id: `visit-${ve.id}`,
      icon: <Heart className="w-3.5 h-3.5" />,
      label: 'Attended Sunday Service',
      description: ve.notes ?? ve.service_name,
      time: ve.service_date,
      color: 'bg-rose-50 text-rose-600',
    });
  });

  visitor.concerns?.forEach((c) => {
    if (c.concern_status === 'confirmed' || c.summary_confirmed) {
      entries.push({
        id: `concern-${c.id}`,
        icon: <MessageCircle className="w-3.5 h-3.5" />,
        label: 'Clarified Her Concern',
        description: 'Was heard deeply and felt her concern was validated and communicated.',
        time: c.updated_at,
        color: 'bg-amber-50 text-amber-600',
      });
    } else if (c.concern_status === 'raised') {
      entries.push({
        id: `concern-${c.id}`,
        icon: <MessageCircle className="w-3.5 h-3.5" />,
        label: 'Shared a Concern',
        description: c.trigger_message ?? undefined,
        time: c.created_at,
        color: 'bg-rose-50 text-rose-600',
      });
    }
  });

  if (visitor.ai_memory && (visitor.ai_memory as Record<string, unknown>).responsive_to_AI) {
    entries.push({
      id: 'engaged-care',
      icon: <Heart className="w-3.5 h-3.5" />,
      label: 'Engaged With Care',
      description: 'Attended Sunday Service – First Visit',
      time: visitor.visit_date ?? visitor.created_at,
      color: 'bg-emerald-50 text-emerald-600',
    });
  }

  if (
    visitor.family_details &&
    (visitor.family_details as Record<string, unknown>).has_kids
  ) {
    entries.push({
      id: 'brought-kids',
      icon: <Baby className="w-3.5 h-3.5" />,
      label: 'Brought Her Kids',
      description: 'Negative response',
      time: visitor.created_at,
      color: 'bg-stone-50 text-stone-500',
    });
  }

  visitor.meeting_invitations?.forEach((mi) => {
    if (mi.status === 'pending' || mi.status === 'accepted') {
      entries.push({
        id: `meeting-${mi.id}`,
        icon: <Coffee className="w-3.5 h-3.5" />,
        label: 'Passion In Coffee',
        description: `${mi.pastor?.name ?? 'Pastor'} · Thursday · Thursday 10:00 AM`,
        time: mi.created_at,
        color: 'bg-amber-50 text-amber-700',
      });
    }
  });

  if ((visitor.ai_memory as Record<string, unknown>)?.mentioned_feeling_unseen) {
    entries.push({
      id: 'deeply-heard',
      icon: <Users className="w-3.5 h-3.5" />,
      label: 'Was Deeply Heard',
      description: "Attended's sache tie gave input seten or dapr for her.",
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      color: 'bg-sky-50 text-sky-600',
    });
  }

  entries.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold tracking-widest text-stone-400 uppercase px-1 mb-3">
        What Happened?
      </h3>
      {entries.map((entry) => (
        <button
          key={entry.id}
          className="w-full flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-stone-50 transition-colors group text-left"
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${entry.color}`}>
            {entry.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-stone-700">{entry.label}</div>
            {entry.description && (
              <div className="text-xs text-stone-400 mt-0.5 truncate">{entry.description}</div>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-400 transition-colors flex-shrink-0 mt-1" />
        </button>
      ))}
    </div>
  );
}
