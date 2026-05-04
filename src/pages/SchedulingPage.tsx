import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useVisitorDetails, useMeetingInvitation } from '../lib/hooks';
import { MeetingInviteCard } from '../components/scheduling/MeetingInviteCard';

export function SchedulingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { visitor, loading: visitorLoading } = useVisitorDetails(id ?? '');
  const { invitation, loading: invLoading, selectTime } = useMeetingInvitation(id ?? '');

  const loading = visitorLoading || invLoading;

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 pt-20 pb-10">
        <div className="animate-pulse space-y-4 max-w-sm mx-auto">
          <div className="h-8 w-40 bg-stone-100 rounded-xl" />
          <div className="h-96 bg-stone-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!visitor || !invitation) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 pt-20 pb-10 text-center">
        <p className="text-stone-400 mb-4">No pending meeting invitation found.</p>
        <button
          onClick={() => navigate(id ? `/visitor/${id}` : '/')}
          className="text-sm text-amber-700 hover:text-amber-800"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 pt-20 pb-10">
      <button
        onClick={() => navigate(`/visitor/${visitor.id}`)}
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {visitor.first_name} {visitor.last_name}
      </button>

      <div className="flex gap-8 items-start justify-center">
        <div className="w-80">
          <MeetingInviteCard
            visitor={visitor}
            invitation={invitation}
            onSelectTime={selectTime}
          />
        </div>

        <div className="max-w-xs pt-2">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-4">
            About This Meeting
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-700 mb-1">Location</p>
              <p className="text-sm text-stone-500">{invitation.location}</p>
            </div>
            {invitation.notes && (
              <div>
                <p className="text-sm font-medium text-stone-700 mb-1">Notes from Pastor</p>
                <p className="text-sm text-stone-500 leading-relaxed">{invitation.notes}</p>
              </div>
            )}
            {invitation.pastor && (
              <div>
                <p className="text-sm font-medium text-stone-700 mb-2">Meeting with</p>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      invitation.pastor.avatar_url ??
                      `https://ui-avatars.com/api/?name=${invitation.pastor.name}&background=e7e5e4&color=78716c`
                    }
                    alt={invitation.pastor.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-100"
                  />
                  <div>
                    <p className="text-sm font-medium text-stone-800">{invitation.pastor.name}</p>
                    <p className="text-xs text-stone-400">{invitation.pastor.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
