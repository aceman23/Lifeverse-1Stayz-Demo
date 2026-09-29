import { Zap } from 'lucide-react';
import { SpecMarker } from '../components/ui/SpecMarker';

export function FollowUpEnginePage() {
  return (
    <SpecMarker id="follow_up_engine">
    <div className="min-h-screen bg-[#f5f6f8] px-6 pt-20 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Follow-Up Engine</h1>
        <p className="text-sm text-stone-400 mt-1">Automated sequences that shepherd every visitor.</p>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#eaf7f1] flex items-center justify-center">
          <Zap className="w-7 h-7 text-[#2ec27e]" strokeWidth={1.5} />
        </div>
        <p className="text-stone-500 font-medium">Follow-Up Engine configuration coming soon</p>
        <p className="text-sm text-stone-400 max-w-xs text-center">
          Design and manage your automated follow-up sequences, message templates, and timing rules.
        </p>
      </div>
    </div>
    </SpecMarker>
  );
}
