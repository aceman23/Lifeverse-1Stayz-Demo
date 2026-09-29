import { CalendarDays } from 'lucide-react';
import { SpecMarker } from '../components/ui/SpecMarker';

export function AppointmentsPage() {
  return (
    <SpecMarker id="appointments">
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Appointments</h1>
        <p className="text-sm text-stone-400 mt-1">Schedule and manage pastoral meetings.</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
          <CalendarDays className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
        </div>
        <p className="text-stone-500 font-medium">Appointments calendar coming soon</p>
        <p className="text-sm text-stone-400 max-w-xs text-center">
          View all scheduled coffee meetings, pastoral visits, and follow-up appointments in one place.
        </p>
      </div>
    </div>
    </SpecMarker>
  );
}
