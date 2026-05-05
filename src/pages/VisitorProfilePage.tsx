import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MoreHorizontal, Play, CheckCircle2, XCircle,
  Mail, MessageSquare, Video, Check, Sparkles, Coffee,
  Calendar, Clock, User, MapPin, X,
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
  brought_kids: 'Came with kids',
  has_family: 'Came with family',
  connected_with_pastor: 'Met with pastor',
  evening_service: 'Evening service attendee',
};

// Deterministic seeded random using visitor id
function seededRand(seed: string, index: number): number {
  let h = index * 2654435761;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return ((h >>> 0) / 0xffffffff);
}

function pickUnique<T>(pool: T[], count: number, seed: string, offset = 0): T[] {
  const available = [...pool];
  const result: T[] = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(seededRand(seed, offset + i) * available.length);
    result.push(available.splice(idx, 1)[0]);
  }
  return result;
}

const FEMALE_NAMES = new Set([
  'sarah', 'rachel', 'maria', 'emily', 'jessica', 'ashley', 'amanda', 'stephanie',
  'jennifer', 'nicole', 'brittany', 'elizabeth', 'megan', 'lauren', 'brittney',
  'lisa', 'karen', 'patricia', 'linda', 'barbara', 'susan', 'margaret', 'sandra',
  'donna', 'carol', 'ruth', 'sharon', 'michelle', 'laura', 'sarah', 'kimberly',
  'deborah', 'dorothy', 'lisa', 'nancy', 'betty', 'helen', 'sandra', 'donna',
  'anna', 'grace', 'claire', 'isabella', 'sophia', 'olivia', 'emma', 'ava',
  'mia', 'abigail', 'madison', 'chloe', 'ella', 'lily', 'natalie', 'hannah',
  'savannah', 'addison', 'aubrey', 'zoe', 'brooklyn', 'nora', 'leah', 'aria',
]);

function isFemale(firstName: string): boolean {
  return FEMALE_NAMES.has(firstName.toLowerCase());
}

const MALE_WHAT_WE_KNOW = [
  'First-time guest',
  'Attended the morning service',
  'Came alone',
  'Came with a friend',
  'Came with his family',
  'Came with his spouse',
  'Has young children at home',
  'Recently moved to the area',
  'Works in the local community',
  'Expressed interest in small groups',
  'Interested in men\'s ministry',
  'Filled out a connection card',
  'Spoke with a greeter',
  'Engaged during worship',
  'Attended a midweek event previously',
];

const FEMALE_WHAT_WE_KNOW = [
  'First-time guest',
  'Attended the morning service',
  'Came alone',
  'Came with a friend',
  'Came with her family',
  'Came with her spouse',
  'Has young children at home',
  'Recently moved to the area',
  'Works in the local community',
  'Expressed interest in small groups',
  'Interested in women\'s ministry',
  'Filled out a connection card',
  'Spoke with a greeter',
  'Engaged during worship',
  'Attended a midweek event previously',
];

const MALE_AI_LEARNED = [
  'Prefers direct, concise messages',
  'Responded well to our welcome text',
  'Opened the follow-up email',
  'Interested in joining a small group',
  'Engaged with men\'s ministry content',
  'Clicked the video link we sent',
  'Has shown consistent interest',
  'Likely to respond to a personal call',
  'Comfortable with digital communication',
  'Attended during a personal transition',
  'Appreciates practical teaching',
  'Responded positively to the gift we sent',
];

const FEMALE_AI_LEARNED = [
  'Prefers warm, personal messages',
  'Responded well to our welcome text',
  'Opened the follow-up email',
  'Interested in joining a small group',
  'Engaged with women\'s ministry content',
  'Clicked the video link we sent',
  'Has shown consistent interest',
  'Likely to respond to a personal call',
  'Comfortable with digital communication',
  'Attended during a personal transition',
  'Values community and connection',
  'Responded positively to the gift we sent',
];

function getWhatWeKnow(visitor: VisitorWithDetails): string[] {
  const female = isFemale(visitor.first_name);
  const pool = female ? FEMALE_WHAT_WE_KNOW : MALE_WHAT_WE_KNOW;
  const seed = visitor.id + '_know';
  const items = pickUnique(pool, 3, seed);
  // Always lead with "First-time guest" if not already in result
  if (!items.includes('First-time guest')) {
    items.unshift('First-time guest');
    items.pop();
  }
  return items;
}

function getAILearned(visitor: VisitorWithDetails): string[] {
  const female = isFemale(visitor.first_name);
  const pool = female ? FEMALE_AI_LEARNED : MALE_AI_LEARNED;
  const seed = visitor.id + '_ai';
  return pickUnique(pool, 4, seed);
}

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
  const [pressing, setPressing] = useState<'yes' | 'no' | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, [responded]);

  function handleRespond(val: 'yes' | 'no') {
    setPressing(val);
    setTimeout(() => {
      setPressing(null);
      setVisible(false);
      setTimeout(() => setResponded(val), 80);
    }, 180);
  }

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
      <div className={`flex flex-col items-center py-8 gap-3 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="w-12 h-12 rounded-full bg-[#2ec27e] flex items-center justify-center animate-[bounceIn_0.4s_ease-out]">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-stone-800">Marked as responded!</p>
        <p className="text-xs text-stone-400 text-center">We'll move {visitor.first_name} to the next stage.</p>
        <button onClick={() => { setVisible(false); setTimeout(() => setResponded(null), 150); }} className="text-xs text-[#2ec27e] hover:underline mt-1 transition-opacity hover:opacity-70">Undo</button>
      </div>
    );
  }

  if (responded === 'no') {
    return (
      <div className={`flex flex-col items-center py-8 gap-3 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center animate-[bounceIn_0.4s_ease-out]">
          <XCircle className="w-6 h-6 text-amber-600" />
        </div>
        <p className="text-sm font-semibold text-stone-800">Noted — no response yet.</p>
        <p className="text-xs text-stone-400 text-center">We'll try a different approach for {visitor.first_name}.</p>
        <button onClick={() => { setVisible(false); setTimeout(() => setResponded(null), 150); }} className="text-xs text-[#2ec27e] hover:underline mt-1 transition-opacity hover:opacity-70">Undo</button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* CTA Buttons */}
      <div className="flex gap-2">
        <button
          onMouseDown={() => setPressing('yes')}
          onMouseUp={() => handleRespond('yes')}
          onMouseLeave={() => setPressing(null)}
          onTouchStart={() => setPressing('yes')}
          onTouchEnd={() => handleRespond('yes')}
          className={`flex-1 bg-[#2ec27e] hover:bg-[#28ae6e] text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150 select-none ${
            pressing === 'yes' ? 'scale-95 bg-[#28ae6e] shadow-inner' : 'scale-100 shadow-sm hover:shadow'
          }`}
        >
          Yes, I got it
        </button>
        <button
          onMouseDown={() => setPressing('no')}
          onMouseUp={() => handleRespond('no')}
          onMouseLeave={() => setPressing(null)}
          onTouchStart={() => setPressing('no')}
          onTouchEnd={() => handleRespond('no')}
          className={`flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold py-2.5 rounded-xl transition-all duration-150 select-none ${
            pressing === 'no' ? 'scale-95 bg-stone-200 shadow-inner' : 'scale-100'
          }`}
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

const COFFEE_TIMES = [
  { day: 'Thursday, May 16, 2024', time: '10:00 AM' },
  { day: 'Thursday, May 16, 2024', time: '4:00 PM' },
  { day: 'Saturday, May 18, 2024', time: '9:30 AM' },
];

function BookCoffeeModal({ visitor, onClose }: { visitor: VisitorWithDetails; onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const [booked, setBooked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setModalVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  function handleConfirm() {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setModalVisible(false);
      setTimeout(() => setBooked(true), 120);
    }, 220);
  }

  const pastor = visitor.pastor ?? { name: 'Pastor Mark', role: 'Lead Pastor', avatar_url: null };

  if (booked) {
    const picked = COFFEE_TIMES[selected];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-[slideUp_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
          {/* Step indicator */}
          <div className="bg-stone-50 border-b border-stone-100 px-5 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#2ec27e] flex items-center justify-center text-white text-xs font-bold shrink-0">5</div>
            <div>
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wide">Coffee Booked</p>
              <p className="text-[11px] text-stone-400">Meeting confirmed & pastor notified</p>
            </div>
          </div>

          <div className="px-6 py-8 flex flex-col items-center gap-4">
            {/* Success icon */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#2ec27e]/30 animate-spin" style={{ animationDuration: '8s' }} />
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#2ec27e]/30"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-36px)`,
                  }}
                />
              ))}
              <div className="w-14 h-14 rounded-full bg-[#1a2e2a] flex items-center justify-center shadow-lg z-10">
                <CheckCircle2 className="w-7 h-7 text-[#2ec27e]" strokeWidth={2} />
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-stone-900">You're all set!</p>
              <p className="text-sm text-stone-500 mt-0.5">Coffee meeting scheduled.</p>
            </div>

            {/* Meeting details */}
            <div className="w-full border border-stone-100 rounded-xl divide-y divide-stone-50 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-sm text-stone-700">{picked.day}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-sm text-stone-700">{picked.time}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <User className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-sm text-stone-700">With {pastor.name}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="text-sm text-stone-700">1Stayz Church — Main Campus</span>
              </div>
            </div>

            {/* Pastor notification */}
            <div className="w-full flex items-center gap-3 bg-[#fdf6ee] border border-amber-100 rounded-xl px-4 py-3">
              {pastor.avatar_url ? (
                <img src={pastor.avatar_url} alt={pastor.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-100" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a2e2a] to-[#2ec27e] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {pastor.name.split(' ').map((n) => n[0]).join('')}
                </div>
              )}
              <p className="text-xs text-stone-600 leading-relaxed">
                <span className="font-semibold">{pastor.name}</span> has been notified and is looking forward to meeting you!
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#2ec27e] hover:bg-[#28ae6e] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              View Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden transition-all duration-200 ${modalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-50 border-b border-stone-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#1a2e2a] flex items-center justify-center text-white shrink-0">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800 uppercase tracking-wide">Book a Coffee Meeting</p>
              <p className="text-[11px] text-stone-400">Schedule time with {visitor.first_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Visitor row */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            {visitor.avatar_url ? (
              <img src={visitor.avatar_url} alt={visitor.first_name} className="w-10 h-10 rounded-full object-cover border border-stone-100 shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a2e2a] to-[#2ec27e] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {initials(visitor)}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-stone-800">{visitor.first_name} {visitor.last_name}</p>
              <p className="text-xs text-stone-400">Coffee with {pastor.name}</p>
            </div>
          </div>

          {/* Time slots */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2.5">Pick a time</p>
            <div className="space-y-2">
              {COFFEE_TIMES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    selected === i
                      ? 'border-[#2ec27e] bg-[#eaf7f1]'
                      : 'border-stone-100 bg-white hover:border-stone-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    selected === i ? 'border-[#2ec27e]' : 'border-stone-300'
                  }`}>
                    {selected === i && <div className="w-2 h-2 rounded-full bg-[#2ec27e]" />}
                  </div>
                  <span className="text-sm text-stone-600">{t.day}</span>
                  <span className="ml-auto text-sm font-semibold text-stone-800">{t.time}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onMouseDown={() => setConfirming(true)}
            onMouseUp={handleConfirm}
            onMouseLeave={() => setConfirming(false)}
            onTouchStart={() => setConfirming(true)}
            onTouchEnd={handleConfirm}
            className={`w-full bg-[#2ec27e] hover:bg-[#28ae6e] text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150 select-none flex items-center justify-center gap-2 ${
              confirming ? 'scale-95 bg-[#28ae6e] shadow-inner' : 'scale-100 shadow-sm hover:shadow'
            }`}
          >
            {confirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Booking...
              </>
            ) : 'Confirm Coffee Meeting'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function VisitorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { visitor, loading } = useVisitorDetails(id ?? '');
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [pressingCoffee, setPressingCoffee] = useState(false);

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

  const whatWeKnow = getWhatWeKnow(visitor);
  const aiLearned = getAILearned(visitor);

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
            <button
              onMouseDown={() => setPressingCoffee(true)}
              onMouseUp={() => { setPressingCoffee(false); setShowCoffeeModal(true); }}
              onMouseLeave={() => setPressingCoffee(false)}
              onTouchStart={() => setPressingCoffee(true)}
              onTouchEnd={() => { setPressingCoffee(false); setShowCoffeeModal(true); }}
              className={`flex items-center gap-1.5 text-sm font-semibold bg-[#2ec27e] hover:bg-[#28ae6e] text-white px-4 py-2 rounded-xl transition-all duration-150 select-none ${
                pressingCoffee ? 'scale-95 bg-[#28ae6e] shadow-inner' : 'scale-100 shadow-sm hover:shadow'
              }`}
            >
              <Coffee className={`w-4 h-4 transition-transform duration-150 ${pressingCoffee ? 'rotate-12' : ''}`} />
              Book Coffee
            </button>
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
                {whatWeKnow.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                    {item}
                  </li>
                ))}
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

      {showCoffeeModal && (
        <BookCoffeeModal visitor={visitor} onClose={() => setShowCoffeeModal(false)} />
      )}
    </div>
  );
}
