import { useOnboarding } from '../../lib/onboarding-context';
import { DEFAULT_MINISTRIES } from '../../data/onboarding';
import { Calendar, Clock, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import type { ServiceRow } from '../../data/onboarding';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Step2Reading() {
  const { state, update } = useOnboarding();

  function addService() {
    const newRow: ServiceRow = {
      id: `svc-${Date.now()}`,
      name: '',
      day: 'Sunday',
      startTime: '10:00',
      endTime: '11:30',
    };
    update({ serviceSchedule: [...state.serviceSchedule, newRow] });
  }

  function updateService(id: string, patch: Partial<ServiceRow>) {
    update({
      serviceSchedule: state.serviceSchedule.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  }

  function deleteService(id: string) {
    update({ serviceSchedule: state.serviceSchedule.filter((s) => s.id !== id) });
  }

  function toggleMinistry(m: string) {
    if (state.ministries.includes(m)) {
      update({ ministries: state.ministries.filter((x) => x !== m) });
    } else {
      update({ ministries: [...state.ministries, m] });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Reading Your Site</h2>
        <p className="text-sm text-stone-500 mt-1">
          We read your website to save you time. Everything below is a draft — review and approve each card.
        </p>
      </div>

      {/* Service schedule */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            <h3 className="text-sm font-semibold text-stone-800">Service Schedule</h3>
          </div>
          <button
            onClick={addService}
            className="text-xs font-medium text-[#10B981] hover:text-[#0d9668] inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add service
          </button>
        </div>

        <p className="text-xs text-stone-400 mb-4 flex items-start gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          Your first text goes out within 30 minutes after the service a guest attended ends.
        </p>

        {state.serviceSchedule.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-stone-400 mb-3">No services added yet.</p>
            <button
              onClick={addService}
              className="text-sm font-medium text-[#10B981] hover:text-[#0d9668] inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add your first service
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {state.serviceSchedule.map((svc) => (
              <div key={svc.id} className="flex items-center gap-2 bg-stone-50/50 rounded-xl p-3">
                <input
                  type="text"
                  value={svc.name}
                  onChange={(e) => updateService(svc.id, { name: e.target.value })}
                  placeholder="Sunday Morning"
                  className="flex-1 text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                />
                <select
                  value={svc.day}
                  onChange={(e) => updateService(svc.id, { day: e.target.value })}
                  className="text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-300" />
                  <input
                    type="time"
                    value={svc.startTime}
                    onChange={(e) => updateService(svc.id, { startTime: e.target.value })}
                    className="text-sm border border-stone-200 rounded-lg px-2.5 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition w-24"
                  />
                  <span className="text-stone-300 text-xs">–</span>
                  <input
                    type="time"
                    value={svc.endTime}
                    onChange={(e) => updateService(svc.id, { endTime: e.target.value })}
                    className="text-sm border border-stone-200 rounded-lg px-2.5 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition w-24"
                  />
                </div>
                <button
                  onClick={() => deleteService(svc.id)}
                  className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ministries */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-1">Ministries & Programs</h3>
        <p className="text-xs text-stone-400 mb-4">Select the ministries your assistant should know about.</p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_MINISTRIES.map((m) => {
            const selected = state.ministries.includes(m);
            return (
              <button
                key={m}
                onClick={() => toggleMinistry(m)}
                className={`text-xs font-medium px-3.5 py-2 rounded-full border transition-all ${
                  selected
                    ? 'bg-[#10B981]/10 text-[#0d9668] border-[#10B981]/30'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                {selected && <Check className="w-3 h-3 inline mr-1" />}
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guest fields */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-1">Guest Info to Collect</h3>
        <p className="text-xs text-stone-400 mb-4">Which fields should your assistant ask guests about?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { key: 'first_name', label: 'First name' },
            { key: 'last_name', label: 'Last name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'household_size', label: 'Household size' },
            { key: 'kids_ages', label: "Kids' ages" },
            { key: 'how_they_heard', label: 'How they heard' },
            { key: 'prayer_request', label: 'Prayer request' },
            { key: 'which_service', label: 'Which service' },
          ].map((f) => {
            const selected = state.guestFields.includes(f.key);
            return (
              <button
                key={f.key}
                onClick={() => {
                  if (selected) {
                    update({ guestFields: state.guestFields.filter((x) => x !== f.key) });
                  } else {
                    update({ guestFields: [...state.guestFields, f.key] });
                  }
                }}
                className={`text-xs font-medium px-3 py-2.5 rounded-lg border transition-all text-left ${
                  selected
                    ? 'bg-[#10B981]/10 text-[#0d9668] border-[#10B981]/30'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                {selected && <Check className="w-3 h-3 inline mr-1" />}
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
