import { useState } from 'react';
import { useOnboarding } from '../../lib/onboarding-context';
import { Check, Smartphone, Mail, Phone, Clock, AlertCircle, Lock, ChevronDown, ChevronUp } from 'lucide-react';

/* ── Inline SVG logos for each ChMS ── */
function PlanningCenterLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
      <rect width="40" height="40" rx="8" fill="#3D71F8" />
      <path d="M10 20a10 10 0 1 1 20 0 10 10 0 0 1-20 0Z" fill="white" fillOpacity=".15" />
      <path d="M20 10v10l7 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SubsplashLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
      <rect width="40" height="40" rx="8" fill="#FF5C35" />
      <path d="M12 26c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="14" r="3.5" fill="white" />
    </svg>
  );
}

function PushpayLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
      <rect width="40" height="40" rx="8" fill="#00A651" />
      <path d="M13 20.5l5 5 9-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RockLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
      <rect width="40" height="40" rx="8" fill="#EE7625" />
      <path d="M12 28L20 12l8 16H12Z" fill="white" fillOpacity=".9" />
      <path d="M16 28l4-8 4 8" fill="#EE7625" />
    </svg>
  );
}

function BreezeLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
      <rect width="40" height="40" rx="8" fill="#33AADD" />
      <path d="M11 17h14M11 21h10M11 25h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const chmsOptions = [
  { id: 'planning_center', label: 'Planning Center', Logo: PlanningCenterLogo, color: '#3D71F8' },
  { id: 'subsplash', label: 'Subsplash', Logo: SubsplashLogo, color: '#FF5C35' },
  { id: 'pushpay', label: 'Pushpay', Logo: PushpayLogo, color: '#00A651' },
  { id: 'rock', label: 'Rock', Logo: RockLogo, color: '#EE7625' },
  { id: 'breeze', label: 'Breeze', Logo: BreezeLogo, color: '#33AADD' },
];

export function Step4Systems() {
  const { state, update } = useOnboarding();
  const [selectedChms, setSelectedChms] = useState<string | null>(null);
  const [chmsExpanded, setChmsExpanded] = useState(true);

  const subsplashOptions = [
    { value: 'webhook', label: 'Webhook', desc: 'Direct integration' },
    { value: 'zapier', label: 'Zapier', desc: 'Connect through Zapier' },
    { value: 'qrcard', label: '1Stayz connection card & QR', desc: 'Posts to Subsplash and 1Stayz' },
  ] as const;

  const emailOptions = [
    { value: 'none', label: 'Not connected' },
    { value: 'gmail', label: 'Gmail' },
    { value: 'outlook', label: 'Outlook' },
    { value: 'yahoo', label: 'Yahoo' },
    { value: 'proton', label: 'Proton Mail' },
    { value: 'icloud', label: 'iCloud Mail' },
    { value: 'zoho', label: 'Zoho Mail' },
    { value: '1stayz', label: '1Stayz email' },
    { value: 'other', label: 'Other' },
  ] as const;

  const disabledIntegrations = [
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
          Your church management system stays the source of truth — 1Stayz handles follow-up.
        </p>
      </div>

      {/* ChMS Import Card */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] overflow-hidden">
        <button
          onClick={() => setChmsExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-stone-800">Church Management System</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              Import guest info
            </span>
          </div>
          {chmsExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {chmsExpanded && (
          <div className="px-6 pb-6">
            <p className="text-xs text-stone-400 mb-4">Select your ChMS so 1Stayz can import guest records automatically.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {chmsOptions.map(({ id, label, Logo }) => {
                const selected = selectedChms === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedChms(selected ? null : id)}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all group ${
                      selected
                        ? 'border-[#10B981]/40 bg-[#10B981]/5 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <Logo />
                    <span className="text-xs font-medium text-stone-700 text-center leading-tight">{label}</span>
                  </button>
                );
              })}

              {/* None / Manual option */}
              <button
                onClick={() => setSelectedChms(selectedChms === 'none' ? null : 'none')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedChms === 'none'
                    ? 'border-stone-400 bg-stone-50'
                    : 'border-stone-200 border-dashed bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-lg text-stone-300">+</span>
                <span className="text-xs font-medium text-stone-400 text-center">We use something else</span>
              </button>
            </div>

            {selectedChms && selectedChms !== 'none' && (
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>{chmsOptions.find((c) => c.id === selectedChms)?.label}</strong> selected — our team will set up the import connection before your pilot Sunday.
                </span>
              </div>
            )}
            {selectedChms === 'none' && (
              <div className="mt-4 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5">
                No problem — you can manually import a guest list as a CSV, or use our connection card &amp; QR code below.
              </div>
            )}
          </div>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {subsplashOptions.filter((o) => o.value !== 'qrcard').map((opt) => {
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

      {/* 1Stayz Connection Card & QR */}
      {(() => {
        const opt = subsplashOptions.find((o) => o.value === 'qrcard')!;
        const selected = state.integrations.subsplash === 'qrcard';
        return (
          <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-800">1Stayz Connection Card &amp; QR</h3>
            </div>
            <p className="text-xs text-stone-400 mb-4">Posts to Subsplash and 1Stayz — use when direct integration isn't available.</p>
            <button
              onClick={() => update({ integrations: { ...state.integrations, subsplash: opt.value } })}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                selected
                  ? 'bg-[#10B981]/5 border-[#10B981]/30'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700">{opt.label}</span>
                {selected && (
                  <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>
          </div>
        );
      })()}

      {/* Email */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Email Provider</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
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
        <div className="flex items-center gap-2 mb-1">
          <Phone className="w-4 h-4 text-stone-400" />
          <h3 className="text-sm font-semibold text-stone-800">Text Number</h3>
        </div>
        <p className="text-xs text-stone-400 mb-3">We will get a number for texting that is local based on your address.</p>
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
