import { CheckCircle2, Clock, XCircle, Smartphone, Globe, ClipboardList, QrCode } from 'lucide-react';

const SOURCE_ICONS: Record<string, typeof Globe> = {
  'Connection Card': ClipboardList,
  'Online Form': Globe,
  'Check-in Kiosk': Smartphone,
  'QR Walk-up': QrCode,
};

const SOURCE_COLORS: Record<string, string> = {
  'Connection Card': 'text-amber-600',
  'Online Form': 'text-sky-600',
  'Check-in Kiosk': 'text-violet-600',
  'QR Walk-up': 'text-emerald-600',
};

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'processed' | 'pending' | 'error';
  timestamp: string;
  service: string;
  tags: string[];
}

interface SubmissionFeedProps {
  submissions: Submission[];
}

const statusConfig = {
  processed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Processed' },
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  error: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Error' },
};

export function SubmissionFeed({ submissions }: SubmissionFeedProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Live Submission Feed</h3>
          <p className="text-xs text-stone-400 mt-0.5">All incoming visitor data in real-time</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>
      <div className="divide-y divide-stone-50">
        {submissions.map((s) => {
          const { icon: StatusIcon, color, bg, label } = statusConfig[s.status];
          const SrcIcon = SOURCE_ICONS[s.source] ?? ClipboardList;
          const srcColor = SOURCE_COLORS[s.source] ?? 'text-stone-500';
          return (
            <div key={s.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-stone-50/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-xs font-semibold text-stone-500">
                {s.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900">{s.name}</p>
                <p className="text-xs text-stone-400 truncate">{s.email} · {s.service}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <SrcIcon className={`w-3.5 h-3.5 ${srcColor}`} />
                <span className="text-xs text-stone-500">{s.source}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bg} shrink-0`}>
                <StatusIcon className={`w-3 h-3 ${color}`} />
                <span className={`text-[11px] font-medium ${color}`}>{label}</span>
              </div>
              <p className="text-xs text-stone-400 shrink-0 w-20 text-right">{s.timestamp}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
