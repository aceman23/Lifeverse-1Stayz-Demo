import { useState, useEffect, useRef } from 'react';
import { useOnboarding } from '../../lib/onboarding-context';
import { DEFAULT_MINISTRIES } from '../../data/onboarding';
import { Calendar, Clock, Plus, Trash2, Check, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { ServiceRow } from '../../data/onboarding';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CHECKLIST_ITEMS = [
  'Reading your website',
  'Finding service times',
  'Finding ministries & events',
  'Looking for your Statement of Faith',
];

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const dh = h % 12 || 12;
  return `${dh}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function Step2Reading() {
  const { state, update } = useOnboarding();
  const [reading, setReading] = useState(true);
  const [checklistIdx, setChecklistIdx] = useState(0);
  const fileRef = useRef(false);

  useEffect(() => {
    if (!fileRef.current) {
      fileRef.current = true;
      const timer = setInterval(() => {
        setChecklistIdx((prev) => {
          if (prev >= CHECKLIST_ITEMS.length - 1) {
            clearInterval(timer);
            setTimeout(() => setReading(false), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (!reading && state.serviceSchedule.length === 0) {
      update({
        serviceSchedule: [
          { id: 'svc-1', name: 'Sunday Morning First Service', day: 'Sunday', startTime: '09:00', endTime: '10:15', reviewed: false },
          { id: 'svc-2', name: 'Sunday Morning Second Service', day: 'Sunday', startTime: '11:00', endTime: '12:15', reviewed: false },
        ],
      });
    }
  }, [reading]);

  if (reading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">Reading Your Site</h2>
          <p className="text-sm text-stone-500 mt-1">
            We're reading your website to save you time. This will just take a moment.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#ECECE8] p-8">
          <div className="space-y-4">
            {CHECKLIST_ITEMS.map((item, i) => {
              const done = i < checklistIdx;
              const active = i === checklistIdx;
              return (
                <div key={item} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    done ? 'bg-emerald-100' : active ? 'bg-amber-100' : 'bg-stone-100'
                  }`}>
                    {done ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                    ) : active ? (
                      <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-stone-300" />
                    )}
                  </div>
                  <span className={`text-sm transition-colors ${
                    done ? 'text-stone-700 font-medium' : active ? 'text-stone-900 font-medium' : 'text-stone-300'
                  }`}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function addService() {
    const newRow: ServiceRow = {
      id: `svc-${Date.now()}`,
      name: '',
      day: 'Sunday',
      startTime: '10:00',
      endTime: '11:30',
      reviewed: false,
    };
    update({ serviceSchedule: [...state.serviceSchedule, newRow] });
  }

  function updateService(id: string, patch: Partial<ServiceRow>) {
    update({
      serviceSchedule: state.serviceSchedule.map((s) => (s.id === id ? { ...s, ...patch, reviewed: false } : s)),
    });
  }

  function deleteService(id: string) {
    update({ serviceSchedule: state.serviceSchedule.filter((s) => s.id !== id) });
  }

  function toggleReview(id: string) {
    update({
      serviceSchedule: state.serviceSchedule.map((s) => (s.id === id ? { ...s, reviewed: !s.reviewed } : s)),
    });
  }

  function toggleMinistry(m: string) {
    if (state.ministries.includes(m)) {
      update({ ministries: state.ministries.filter((x) => x !== m) });
    } else {
      update({ ministries: [...state.ministries, m] });
    }
  }

  function timeError(svc: ServiceRow): string | null {
    if (svc.startTime && svc.endTime && svc.startTime >= svc.endTime) {
      return 'End time must be after start time';
    }
    return null;
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
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
              Draft — needs pastor review
            </span>
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
            <p className="text-sm text-stone-400 mb-3">No services found.</p>
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
            {state.serviceSchedule.map((svc) => {
              const err = timeError(svc);
              return (
                <div key={svc.id} className="bg-stone-50/50 rounded-xl p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={svc.name}
                      onChange={(e) => updateService(svc.id, { name: e.target.value })}
                      placeholder="Sunday Morning"
                      className="flex-1 min-w-[140px] text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
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
                  {err && (
                    <p className="text-xs text-rose-500 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {err}
                    </p>
                  )}
                  {!err && svc.startTime && svc.endTime && (
                    <p className="text-xs text-stone-400 mt-2">
                      First text sends by {formatTime(addMinutes(svc.endTime, 30))}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    {svc.reviewed ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleReview(svc.id)}
                        disabled={!!err || !svc.name.trim()}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 border border-stone-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Looks right
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ministries */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-stone-800">Ministries & Programs</h3>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            Draft — needs pastor review
          </span>
        </div>
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
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-stone-800">Guest Info to Collect</h3>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            Draft — needs pastor review
          </span>
        </div>
        <p className="text-xs text-stone-400 mb-4">Which fields should your assistant ask guests about?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { key: 'first_name', label: 'First name', required: true },
            { key: 'last_name', label: 'Last name', required: true },
            { key: 'phone', label: 'Phone', required: true },
            { key: 'email', label: 'Email', required: true },
            { key: 'household_size', label: 'Household size', required: false },
            { key: 'kids_ages', label: "Kids' ages", required: false },
            { key: 'how_they_heard', label: 'How they heard', required: false },
            { key: 'prayer_request', label: 'Prayer request', required: false },
            { key: 'which_service', label: 'Which service', required: false },
          ].map((f) => {
            const selected = f.required || state.guestFields.includes(f.key);
            return (
              <button
                key={f.key}
                disabled={f.required}
                onClick={() => {
                  if (f.required) return;
                  if (state.guestFields.includes(f.key)) {
                    update({ guestFields: state.guestFields.filter((x) => x !== f.key) });
                  } else {
                    update({ guestFields: [...state.guestFields, f.key] });
                  }
                }}
                className={`text-xs font-medium px-3 py-2.5 rounded-lg border transition-all text-left ${
                  f.required
                    ? 'bg-[#10B981]/10 text-[#0d9668] border-[#10B981]/30 cursor-default'
                    : selected
                      ? 'bg-[#10B981]/10 text-[#0d9668] border-[#10B981]/30 hover:bg-[#10B981]/15'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                <Check className="w-3 h-3 inline mr-1" style={{ opacity: selected ? 1 : 0 }} />
                {f.label}
                {f.required && (
                  <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wide text-[#0d9668]/60">required</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
