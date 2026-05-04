import { ChevronRight, Check } from 'lucide-react';
import type { MeetingInvitation, Visitor } from '../../lib/types';

interface MeetingInviteCardProps {
  visitor: Visitor;
  invitation: MeetingInvitation;
  onSelectTime: (time: string) => void;
  selectedTime?: string | null;
}

export function MeetingInviteCard({
  visitor,
  invitation,
  onSelectTime,
  selectedTime,
}: MeetingInviteCardProps) {
  const accepted = invitation.status === 'accepted' || selectedTime;

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 overflow-hidden rounded-2xl">
        <img
          src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=600"
          alt="Pastor"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
            {accepted ? (
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-semibold text-stone-800 mb-1">You're all set!</p>
                <p className="text-sm text-stone-500">
                  {invitation.pastor?.name ?? 'Pastor Mark'} will be looking forward to meeting you.
                </p>
              </div>
            ) : (
              <>
                <p className="text-stone-700 text-base leading-relaxed">
                  <span className="font-semibold text-stone-900">{visitor.first_name}</span>{' '}
                  &mdash; thank you for taking a moment.
                  <br />
                  What you&rsquo;ve shared mattered to us.
                  <br />
                  And we&rsquo;d really love to meet you.
                </p>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2.5 text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200">
                    Reply
                  </button>
                  <button
                    onClick={() =>
                      invitation.proposed_times?.[0] &&
                      onSelectTime(invitation.proposed_times[0].datetime)
                    }
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors"
                  >
                    Choose a Time
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {!accepted && (
        <div className="mt-4">
          <p className="text-xs text-stone-400 mb-3 px-1">
            May I offer a few suggested times for us to meet?
          </p>
          <div className="space-y-2">
            {invitation.proposed_times?.map((slot, i) => (
              <button
                key={i}
                onClick={() => onSelectTime(slot.datetime)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors group bg-white/60"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-amber-400' : 'bg-stone-300'
                    }`}
                  />
                  <div className="text-left">
                    <span className="text-sm font-medium text-stone-700">
                      {slot.day}
                    </span>
                    <span className="text-sm text-stone-400"> &bull; {slot.time}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
