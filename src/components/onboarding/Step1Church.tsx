import { useOnboarding } from '../../lib/onboarding-context';
import { ROLE_OPTIONS, TIMEZONES } from '../../data/onboarding';
import { Building2, Globe, Clock, Phone, User } from 'lucide-react';

export function Step1Church() {
  const { state, update } = useOnboarding();
  const c = state.church;

  function updateChurch(patch: Partial<typeof c>) {
    update({ church: { ...c, ...patch } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Your Church</h2>
        <p className="text-sm text-stone-500 mt-1">
          Tell us about your church so 1Stayz can personalize every conversation.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Church name" icon={Building2}>
            <input
              type="text"
              value={c.name}
              onChange={(e) => updateChurch({ name: e.target.value })}
              placeholder="Grace Community Church"
              className={inputClass}
            />
          </Field>

          <Field label="Your name" icon={User}>
            <input
              type="text"
              value={c.yourName}
              onChange={(e) => updateChurch({ yourName: e.target.value })}
              placeholder="Pastor Ray"
              className={inputClass}
            />
          </Field>

          <Field label="Your role">
            <select
              value={c.yourRole}
              onChange={(e) => updateChurch({ yourRole: e.target.value })}
              className={inputClass}
            >
              <option value="">Select your role…</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>

          <Field label="Church phone" icon={Phone}>
            <input
              type="tel"
              value={c.phone}
              onChange={(e) => updateChurch({ phone: e.target.value })}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
          </Field>

          <Field label="Website" icon={Globe}>
            <input
              type="text"
              value={c.website}
              onChange={(e) => updateChurch({ website: e.target.value })}
              placeholder="gracecommunity.org"
              className={inputClass}
            />
          </Field>

          <Field label="Time zone" icon={Clock}>
            <select
              value={c.timezone}
              onChange={(e) => updateChurch({ timezone: e.target.value })}
              className={inputClass}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Church address">
          <input
            type="text"
            value={c.address}
            onChange={(e) => updateChurch({ address: e.target.value })}
            placeholder="123 Main St, Springfield, IL 62701"
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}

const inputClass = 'w-full text-sm border border-stone-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition placeholder:text-stone-300';

function Field({ label, icon: Icon, children }: { label: string; icon?: typeof Globe; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-stone-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}
