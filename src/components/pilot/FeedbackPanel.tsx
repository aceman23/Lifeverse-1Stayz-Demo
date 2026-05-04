import { Star } from 'lucide-react';

export interface PastorFeedback {
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  tags: string[];
}

export interface VisitorFeedback {
  initials: string;
  week: number;
  rating: number;
  comment: string;
  date: string;
  channel: string;
}

interface PastorFeedbackPanelProps {
  feedback: PastorFeedback[];
}

interface VisitorFeedbackPanelProps {
  feedback: VisitorFeedback[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'}`}
        />
      ))}
    </div>
  );
}

export function PastorFeedbackPanel({ feedback }: PastorFeedbackPanelProps) {
  return (
    <div className="space-y-4">
      {feedback.map((f) => (
        <div key={f.name} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-sm font-semibold text-stone-600">
                {f.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">{f.name}</p>
                <p className="text-xs text-stone-400">{f.role}</p>
              </div>
            </div>
            <div className="text-right">
              <Stars rating={f.rating} />
              <p className="text-[11px] text-stone-400 mt-1">{f.date}</p>
            </div>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed italic">"{f.comment}"</p>
          {f.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {f.tags.map((tag) => (
                <span key={tag} className="text-[11px] bg-stone-50 border border-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function VisitorFeedbackPanel({ feedback }: VisitorFeedbackPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-stone-50">
        {feedback.map((f, i) => (
          <div key={i} className="px-5 py-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-[11px] font-semibold text-amber-700">
                {f.initials}
              </div>
              <Stars rating={f.rating} />
              <span className="text-xs text-stone-400 ml-auto">{f.date} · Week {f.week} · {f.channel}</span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">"{f.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
