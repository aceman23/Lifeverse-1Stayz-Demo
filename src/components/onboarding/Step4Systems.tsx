import { useOnboarding } from '../../lib/onboarding-context';
import { Check, Smartphone, Mail, Phone, Clock, AlertCircle, Lock } from 'lucide-react';

export function Step4Systems() {
  const { state, update } = useOnboarding();

  const subsplashOptions = [
    { value: 'webhook', label: 'Webhook', desc: 'Direct integration' },
    { value: 'zapier', label: 'Zapier', desc: 'Connect through Zapier' },
    { value: 'qrcard', label: '1Stayz connection card & QR', desc: 'Posts to Subsplash and 1Stayz' },
  ] as const;

  const emailOptions = [
    { value: 'none', label: 'Not connected' },
    { value: 'gmail', label: 'Gmail' },
    { value: 'outlook', label: 'Outlook' },
    { value: '1stayz', label: '1Stayz email' },
  ] as const;

  const disabledIntegrations = [
    { label: 'Planning Center', desc: 'Service planning' },
    { label: 'Google Calendar', desc: 'Staff scheduling' },
    { label: 'Mailchimp', desc: 'Email campaigns' },
  ];

  const smsStatuses = ['submitted', 'pending', 'approved'] as const;
  const smsLabels: Record<string, string> = {
    submitted: 'Submitted to carrier',
    pending: 'Pending carrier approval',
    approved: 'Approved — text number active',
  };
  const smsColors: Record<string, string> = {
    submitted: 'bg-stone-50 text-stone-600 border-stone-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Connect Systems</h2>
        <p className="text-sm text-stone-500 mt-1">
          Subsplash stays your system of record — 1Stayz only runs follow-up.
        </p>
      </div>

      {/* Subsplash */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Smartphone className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Subsplash (Church App)</h3>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
            Required
          </span>
        </div>
        <p className="text-xs text-stone-400 mb-4">Choose how 1Stayz connects to Subsplash.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {subsplashOptions.map((opt) => {
            const selected = state.integrations.subsplash === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update({ integrations: { ...state.integrations, subsplash: opt.value } })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selected
                    ? 'bg-[#10B981]/5 border-[#10B981]/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-stone-700">{opt.label}</span>
                  {selected && (
                    <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-stone-400">{opt.desc}</p>
              </button>
            );
          })}
        </div>
        {state.integrations.subsplash === 'none' && (
          <p className="text-xs text-rose-500 mt-3 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Subsplash connection is required before you can go live.
          </p>
        )}
      </div>

      {/* Email */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Email Provider</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {emailOptions.map((opt) => {
            const selected = state.integrations.email === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update({ integrations: { ...state.integrations, email: opt.value } })}
                className={`p-3 rounded-xl border transition-all text-center ${
                  selected
                    ? 'bg-[#10B981]/5 border-[#10B981]/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-sm font-medium text-stone-700">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SMS status */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Text Number</h3>
        </div>
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${smsColors[state.integrations.smsStatus]}`}>
          <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-stone-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-700">{smsLabels[state.integrations.smsStatus]}</p>
            <p className="text-xs text-stone-500 mt-0.5">
              {state.integrations.smsStatus === 'approved'
                ? 'Text messages are ready to send.'
                : 'Until approved, we\'ll reach out by email first. Carrier registration timing varies.'}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-stone-400">Demo: cycle status</span>
          {smsStatuses.map((s) => (
            <button
              key={s}
              onClick={() => update({ integrations: { ...state.integrations, smsStatus: s } })}
              className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors capitalize ${
                state.integrations.smsStatus === s
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-400 border-stone-200 hover:border-stone-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {state.integrations.smsStatus !== 'approved' && (
          <label className="flex items-start gap-2.5 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.integrations.emailFallbackAcknowledged}
              onChange={(e) => update({ integrations: { ...state.integrations, emailFallbackAcknowledged: e.target.checked } })}
              className="w-4 h-4 rounded accent-[#10B981] mt-0.5"
            />
            <span className="text-xs text-stone-500">
              I understand 1Stayz will use email-first follow-up until the text number is approved.
            </span>
          </label>
        )}
      </div>

      {/* Coming later */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">More integrations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {disabledIntegrations.map((d) => (
            <div key={d.label} className="p-4 rounded-xl border border-stone-100 bg-stone-50/30 opacity-60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-stone-500">{d.label}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-400 inline-flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Coming later
                </span>
              </div>
              <p className="text-xs text-stone-400">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
