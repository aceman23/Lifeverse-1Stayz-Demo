import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MoreHorizontal, Play, CheckCircle2, XCircle,
  Mail, MessageSquare, Video, Check, Sparkles,
} from 'lucide-react';
import { useVisitorDetails } from '../lib/hooks';
import { formatDate } from '../lib/utils';
import type { VisitorWithDetails } from '../lib/types';

function initials(v: VisitorWithDetails) {
  return `${v.first_name[0] ?? ''}${v.last_name[0] ?? ''}`.toUpperCase();
}

const TAG_LABELS: Record<string, string> = {
  first_time_guest: 'First-time guest',
  returning_guest: 'Returning guest',
  recently_moved: 'Recently moved to town',
  college_student: 'College student',
  single_parent: 'Single parent',
  brought_kids: 'Came with her kids',
  has_family: 'Came with family',
  connected_with_pastor: 'Met with pastor',
  evening_service: 'Evening service attendee',
};

const AI_LEARNED: Record<string, string> = {
  first_time_guest: 'Prefers short messages',
  returning_guest: 'Responded to our gift',
  brought_kids: 'Interested in community',
  has_family: 'Enjoys family ministry',
  recently_moved: 'New to the area',
  connected_with_pastor: 'Connected with pastoral team',
  college_student: 'Interested in young adults group',
};

const JOURNEY_STEPS = [
  { key: 'text', label: 'Text Sent' },
  { key: 'email', label: 'Email Sent' },
  { key: 'video', label: 'Video Sent' },
  { key: 'response', label: 'Response' },
];

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="w-3.5 h-3.5" />,
  sms: <MessageSquare className="w-3.5 h-3.5" />,
  video: <Video className="w-3.5 h-3.5" />,
};

function VideoPanel({ visitor }: { visitor: VisitorWithDetails }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1a2e2a] aspect-video w-full">
      <img
        src={visitor.avatar_url ?? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'}
        alt={visitor.first_name}
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      {!playing && (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </button>
      )}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between">
        <p className="text-white text-sm font-medium drop-shadow">
          {visitor.first_name} — this message is for you.
        </p>
        <span className="text-white/70 text-xs">0:00 / 1:15</span>
      </div>
    </div>
  );
}

function JourneyTimeline({ visitor }: { visitor: VisitorWithDetails }) {
  const events = visitor.communication_events ?? [];
  const completedSteps = new Set<string>();
  events.forEach((e) => {
    if (e.channel === 'sms' || e.channel === 'text') completedSteps.add('text');
    if (e.channel === 'email') completedSteps.add('email');
    if (e.channel === 'video') completedSteps.add('video');
    if (e.direction === 'inbound') completedSteps.add('response');
  });

  const hasAny = completedSteps.size > 0 || events.length > 0;
  if (!hasAny) {
    completedSteps.add('text');
    completedSteps.add('email');
    completedSteps.add('video');
    completedSteps.add('response');
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-stone-800 mb-3">Journey Timeline</h3>
      <div className="flex items-center gap-0">
        {JOURNEY_STEPS.map((step, i) => {
          const done = completedSteps.has(step.key);
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? 'bg-[#2ec27e] border-[#2ec27e]'
                    : 'bg-white border-stone-200'
                }`}>
                  {done
                    ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    : <div className="w-2 h-2 rounded-full bg-stone-200" />
                  }
                </div>
                <span className="text-[10px] text-stone-500 text-center leading-tight whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {i < JOURNEY_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full ${done ? 'bg-[#2ec27e]' : 'bg-stone-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CTAPanel({ visitor }: { visitor: VisitorWithDetails }) {
  const [responded, setResponded] = useState<'yes' | 'no' | null>(null);

  const whySent = visitor.follow_up_status === 'concern_raised' || visitor.follow_up_status === 'escalated'
    ? { goal: 'Re-engage', trigger: 'No response to email', action: 'Video message', reason: 'Highest response rate' }
    : { goal: 'Deepen connection', trigger: 'High engagement score', action: 'Video message', reason: 'Best next step' };

  const channels = visitor.communication_events?.slice(0, 3).map((e) => ({
    channel: e.channel,
    status: e.direction === 'outbound' ? (e.status ?? 'Sent') : 'Replied',
  })) ?? [
    { channel: 'email', status: 'Not opened' },
    { channel: 'sms', status: 'Delivered' },
    { channel: 'video', status: 'Clicked' },
  ];

  if (responded === 'yes') {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <div className="w-12 h-12 rounded-full bg-[#2ec27e] flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-stone-800">Marked as responded!</p>
        <p className="text-xs text-stone-400 text-center">We'll move {visitor.first_name} to the next stage.</p>
        <button onClick={() => setResponded(null)} className="text-xs text-[#2ec27e] hover:underline mt-1">Undo</button>
      </div>
    );
  }

  if (responded === 'no') {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
          <XCircle className="w-6 h-6 text-amber-600" />
        </div>
        <p className="text-sm font-semibold text-stone-800">Noted — no response yet.</p>
        <p className="text-xs text-stone-400 text-center">We'll try a different approach for {visitor.first_name}.</p>
        <button onClick={() => setResponded(null)} className="text-xs text-[#2ec27e] hover:underline mt-1">Undo</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* CTA Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setResponded('yes')}
          className="flex-1 bg-[#1a2e2a] hover:bg-[#243d37] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          Yes, I got it
        </button>
        <button
          onClick={() => setResponded('no')}
          className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          No, I didn't
        </button>
      </div>

      {/* Why sent + how reached */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-2">Why this message was sent</p>
          <ul className="space-y-1.5">
            {[
              { label: 'Goal', value: whySent.goal },
              { label: 'Trigger', value: whySent.trigger },
              { label: 'Action', value: whySent.action },
              { label: 'Reason', value: whySent.reason },
            ].map((row) => (
              <li key={row.label} className="flex items-start gap-1.5">
                <span className="text-[#2ec27e] mt-0.5 shrink-0"><Check className="w-3 h-3" strokeWidth={3} /></span>
                <span className="text-xs text-stone-500"><span className="font-medium text-stone-700">{row.label}:</span> {row.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-2">How we reached {visitor.first_name}</p>
          <ul className="space-y-1.5">
            {channels.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-stone-400">{CHANNEL_ICONS[c.channel] ?? <Mail className="w-3.5 h-3.5" />}</span>
                <span className="text-xs text-stone-500 capitalize">{c.channel}</span>
                <span className="ml-auto text-[10px] text-stone-400">{c.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function VisitorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { visitor, loading } = useVisitorDetails(id ?? '');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
        <div className="max-w-5xl mx-auto animate-pulse space-y-4">
          <div className="h-6 w-32 bg-stone-100 rounded-xl" />
          <div className="h-24 bg-stone-100 rounded-2xl" />
          <div className="h-64 bg-stone-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-400 mb-3">Visitor not found.</p>
          <button onClick={() => navigate('/people')} className="text-sm text-[#2ec27e] hover:underline">
            Back to People
          </button>
        </div>
      </div>
    );
  }

  const aiLearned = visitor.segmentation_tags
    ?.filter((t) => AI_LEARNED[t])
    .map((t) => AI_LEARNED[t]) ?? [];

  if (aiLearned.length === 0) {
    aiLearned.push('Prefers short messages', 'Responded to our gift', 'Interested in community', 'Enjoys kids ministry');
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Back + edit row */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate('/people')}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to People
          </button>
          <div className="flex items-center gap-2">
            <button className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors">
              Edit Profile
            </button>
            <button className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Name + tag */}
        <div className="flex items-center gap-3 mb-6">
          {visitor.avatar_url ? (
            <img src={visitor.avatar_url} alt={visitor.first_name} className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a2e2a] to-[#2ec27e] flex items-center justify-center text-white font-semibold">
              {initials(visitor)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-stone-900">{visitor.first_name} {visitor.last_name}</h1>
              <span className="text-xs font-medium bg-[#eaf7f1] text-[#1a7a4a] border border-[#2ec27e]/20 px-2.5 py-1 rounded-full">
                {TAG_LABELS[visitor.segmentation_tags?.[0]] ?? 'First-time guest'}
              </span>
            </div>
            {visitor.visit_date && (
              <p className="text-sm text-stone-400 mt-0.5">
                Visited on {formatDate(visitor.visit_date)}
                {visitor.segmentation_tags?.includes('brought_kids') || visitor.segmentation_tags?.includes('has_family')
                  ? ' · Came with kids'
                  : ''}
              </p>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* What We Know */}
            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-stone-800 mb-3">What We Know</h3>
              <ul className="space-y-2">
                {visitor.segmentation_tags?.map((tag) => (
                  <li key={tag} className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                    {TAG_LABELS[tag] ?? tag.replace(/_/g, ' ')}
                  </li>
                ))}
                {(visitor.segmentation_tags?.length ?? 0) === 0 && (
                  <>
                    <li className="flex items-center gap-2 text-sm text-stone-600"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />First-time guest</li>
                    <li className="flex items-center gap-2 text-sm text-stone-600"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />Came with her kids</li>
                  </>
                )}
              </ul>
            </div>

            {/* What AI Learned */}
            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-stone-800">What I've Learned About {visitor.first_name}</h3>
              </div>
              <ul className="space-y-2">
                {aiLearned.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
                    <Check className="w-3.5 h-3.5 text-[#2ec27e] shrink-0" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Journey Timeline */}
            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <JourneyTimeline visitor={visitor} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Video panel */}
            <VideoPanel visitor={visitor} />

            {/* CTA + context */}
            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <CTAPanel visitor={visitor} />
            </div>
          </div>
        </div>

        {/* Assigned pastor */}
        {visitor.pastor && (
          <div className="mt-4 bg-white border border-stone-100 rounded-2xl p-5 flex items-center gap-4">
            <img
              src={visitor.pastor.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(visitor.pastor.name)}&background=e7e5e4&color=78716c`}
              alt={visitor.pastor.name}
              className="w-10 h-10 rounded-full object-cover border border-stone-100"
            />
            <div>
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Assigned Pastor</p>
              <p className="text-sm font-semibold text-stone-800">{visitor.pastor.name}</p>
              <p className="text-xs text-stone-400">{visitor.pastor.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
