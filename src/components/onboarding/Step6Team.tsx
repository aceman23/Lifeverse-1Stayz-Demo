import { useOnboarding } from '../../lib/onboarding-context';
import { Plus, Trash2, GripVertical, Bell, Clock, Phone, Check, Shield } from 'lucide-react';
import type { StaffMember } from '../../data/onboarding';

export function Step6Team() {
  const { state, update } = useOnboarding();

  function addStaff() {
    const newStaff: StaffMember = {
      id: `s-${Date.now()}`,
      name: '',
      role: '',
      mobile: '',
      email: '',
      receivesEscalations: false,
      receivesCare: false,
      receivesGeneral: false,
    };
    update({ staff: [...state.staff, newStaff] });
  }

  function updateStaff(id: string, patch: Partial<StaffMember>) {
    update({ staff: state.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function deleteStaff(id: string) {
    update({
      staff: state.staff.filter((s) => s.id !== id),
      escalationOrder: state.escalationOrder.filter((x) => x !== id),
    });
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const order = [...state.escalationOrder];
    [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
    update({ escalationOrder: order });
  }

  function moveDown(idx: number) {
    if (idx === state.escalationOrder.length - 1) return;
    const order = [...state.escalationOrder];
    [order[idx], order[idx + 1]] = [order[idx + 1], order[idx]];
    update({ escalationOrder: order });
  }

  const escalationStaff = state.escalationOrder
    .map((id) => state.staff.find((s) => s.id === id))
    .filter(Boolean) as StaffMember[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Team & Escalations</h2>
        <p className="text-sm text-stone-500 mt-1">
          When someone needs a pastor, 1Stayz needs to know who to contact and in what order.
        </p>
      </div>

      {/* Staff list */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-stone-800">Team Members</h3>
          <button
            onClick={addStaff}
            className="text-xs font-medium text-[#10B981] hover:text-[#0d9668] inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add member
          </button>
        </div>
        <div className="space-y-3">
          {state.staff.map((s) => (
            <div key={s.id} className="border border-stone-100 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateStaff(s.id, { name: e.target.value })}
                  placeholder="Name"
                  className="flex-1 min-w-[120px] text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                />
                <input
                  type="text"
                  value={s.role}
                  onChange={(e) => updateStaff(s.id, { role: e.target.value })}
                  placeholder="Role"
                  className="flex-1 min-w-[100px] text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                />
                <button
                  onClick={() => deleteStaff(s.id)}
                  className="p-2 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="tel"
                  value={s.mobile}
                  onChange={(e) => updateStaff(s.id, { mobile: e.target.value })}
                  placeholder="Mobile"
                  className="flex-1 min-w-[120px] text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                />
                <input
                  type="email"
                  value={s.email}
                  onChange={(e) => updateStaff(s.id, { email: e.target.value })}
                  placeholder="Email"
                  className="flex-1 min-w-[120px] text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: 'receivesEscalations' as const, label: 'Escalations' },
                  { key: 'receivesCare' as const, label: 'Care' },
                  { key: 'receivesGeneral' as const, label: 'General' },
                ].map((ch) => (
                  <button
                    key={ch.key}
                    onClick={() => updateStaff(s.id, { [ch.key]: !s[ch.key] })}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      s[ch.key]
                        ? 'bg-[#10B981]/10 text-[#0d9668] border-[#10B981]/30'
                        : 'bg-white text-stone-400 border-stone-200'
                    }`}
                  >
                    {s[ch.key] && <Check className="w-3 h-3 inline mr-1" />}
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation order */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-1">Escalation Order</h3>
        <p className="text-xs text-stone-400 mb-4">Who gets contacted first, second, third…</p>
        <div className="space-y-2">
          {escalationStaff.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-stone-50/50 rounded-xl">
              <GripVertical className="w-4 h-4 text-stone-300" />
              <div className="w-6 h-6 rounded-full bg-[#1a2e2a] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <span className="text-sm font-medium text-stone-700 flex-1">{s.name || 'Unnamed'}</span>
              <span className="text-xs text-stone-400">{s.role}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition-colors"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === escalationStaff.length - 1}
                  className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition-colors"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 15-minute badge */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-sm text-blue-700 font-medium">
          A human replies to escalations within 15 minutes
        </p>
      </div>

      {/* Quiet hours */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Quiet Hours</h3>
        </div>
        <p className="text-xs text-stone-400 mb-4">No automated texts during these hours in the GUEST's local time.</p>
        <div className="flex items-center gap-3">
          <div>
            <label className="text-xs text-stone-500 mb-1 block">Start</label>
            <input
              type="time"
              value={state.quietHoursStart}
              onChange={(e) => update({ quietHoursStart: e.target.value })}
              className="text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition"
            />
          </div>
          <span className="text-stone-300 mt-5">–</span>
          <div>
            <label className="text-xs text-stone-500 mb-1 block">End</label>
            <input
              type="time"
              value={state.quietHoursEnd}
              onChange={(e) => update({ quietHoursEnd: e.target.value })}
              className="text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition"
            />
          </div>
        </div>
      </div>

      {/* Staff alerts */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Staff Alerts</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.staffAlertsEnabled}
              onChange={(e) => update({ staffAlertsEnabled: e.target.checked })}
              className="w-4 h-4 rounded accent-[#10B981]"
            />
            <span className="text-sm text-stone-700">Enable SMS alerts to staff when escalations occur</span>
          </label>
          {state.staffAlertsEnabled && (
            <>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1.5 block flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  Alert phone number
                </label>
                <input
                  type="tel"
                  value={state.staffAlertsPhone}
                  onChange={(e) => update({ staffAlertsPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full text-sm border border-stone-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300"
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.staffAlertsConsent}
                  onChange={(e) => update({ staffAlertsConsent: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#10B981] mt-0.5"
                />
                <span className="text-xs text-stone-500">
                  I confirm that staff members have consented to receive SMS alerts at this number.
                  <span className="text-rose-500 font-medium"> Required to continue.</span>
                </span>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
