import { useOnboarding } from '../../lib/onboarding-context';
import { Check, Smartphone, Mail, Phone, Clock, AlertCircle } from 'lucide-react';

export function Step4Systems() {
  const { state, update } = useOnboarding();

  const subsplashOptions = [
    { value: 'none', label: 'Not connected', desc: 'We can set this up later' },
    { value: 'webhook', label: 'Webhook', desc: 'Direct integration' },
    { value: 'zapier', label: 'Zapier', desc: 'Connect through Zapier' },
    { value: 'qrcard', label: 'QR card', desc: 'Guest scans a card at the door' },
  ] as const;

  const emailOptions = [
    { value: 'none', label: 'Not connected' },
    { value: 'gmail', label: 'Gmail' },
    { value: 'outlook', label: 'Outlook' },
    { value: '1stayz', label: '1Stayz email' },
  ] as const;

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
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Subsplash (Church App)</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
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
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-700">Pending carrier approval</p>
            <p className="text-xs text-stone-400 mt-0.5">
              Until your text number is approved, we'll reach out by email first. Typically 2-3 business days.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          You can skip this step and come back later — 1Stayz works with email follow-up until your text number is approved.
        </p>
      </div>
    </div>
  );
}
