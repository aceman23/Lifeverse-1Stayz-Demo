import { useOnboarding } from '../../lib/onboarding-context';
import { CheckCircle2, Clock, Eye, Zap, ArrowRight, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Step8Ready() {
  const { state, update } = useOnboarding();
  const navigate = useNavigate();

  const checks = [
    {
      key: 'church',
      label: 'Church profile reviewed',
      step: 0,
      ok: state.church.name.trim() !== '' && state.church.yourName.trim() !== '' && state.church.yourRole !== '',
    },
    {
      key: 'schedule',
      label: 'Service schedule set',
      step: 1,
      ok: state.serviceSchedule.length > 0 && state.serviceSchedule.every((s) => s.name.trim() !== '' && s.startTime < s.endTime),
    },
    {
      key: 'subsplash',
      label: 'Subsplash connected',
      step: 3,
      ok: state.integrations.subsplash !== 'none',
    },
    {
      key: 'guardrails',
      label: 'Guardrails approved by pastor',
      step: 4,
      ok: !!state.guardrailsApprovedBy,
    },
    {
      key: 'team',
      label: 'Team & escalation contacts set',
      step: 5,
      ok: state.staff.length > 0 && state.staff.some((s) => s.receivesEscalations),
    },
    {
      key: 'message',
      label: 'First message approved by pastor',
      step: 6,
      ok: state.firstMessageStatus === 'approved',
    },
    {
      key: 'consent',
      label: 'Consent wording live on connection card',
      step: 6,
      ok: state.integrations.consentWordingLive,
      manual: true,
    },
    {
      key: 'sms',
      label: 'Text number approved OR email-first fallback acknowledged',
      step: 3,
      ok: state.integrations.smsStatus === 'approved' || state.integrations.emailFallbackAcknowledged,
    },
    {
      key: 'shadow',
      label: 'Shadow Sunday completed',
      step: 7,
      ok: state.integrations.shadowSundayCompleted,
      manual: true,
      disabled: state.mode !== 'shadow' && !state.integrations.shadowSundayCompleted,
    },
  ];

  const allGreen = checks.every((c) => c.ok);

  function goToStep(step: number) {
    update({ currentStep: step });
  }

  function handleGoShadow() {
    update({ mode: 'shadow', completed: true });
    sessionStorage.setItem('1stayz_shadow_just_started', '1');
    navigate('/today');
  }

  function handleGoLive() {
    update({ mode: 'live', completed: true });
    sessionStorage.setItem('1stayz_shadow_just_started', '1');
    navigate('/today');
  }

  function toggleManual(key: string) {
    if (key === 'consent') {
      update({ integrations: { ...state.integrations, consentWordingLive: !state.integrations.consentWordingLive } });
    } else if (key === 'shadow') {
      if (state.mode === 'shadow' || state.integrations.shadowSundayCompleted) {
        update({ integrations: { ...state.integrations, shadowSundayCompleted: !state.integrations.shadowSundayCompleted } });
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">Ready Check</h2>
        <p className="text-sm text-stone-500 mt-1">
          Almost there! Choose how you want to start.
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-[#ECECE8] p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">Setup checklist</h3>
        <div className="space-y-2.5">
          {checks.map((c) => (
            <div key={c.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50/50 transition-colors">
              {c.ok ? (
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                </div>
              )}
              <span className={`text-sm flex-1 ${c.ok ? 'text-stone-700' : 'text-stone-500'}`}>
                {c.label}
              </span>
              {c.manual ? (
                <button
                  onClick={() => toggleManual(c.key)}
                  disabled={c.disabled}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    c.ok
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : c.disabled
                        ? 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {c.ok ? 'Done' : c.disabled ? 'Start shadow first' : 'Mark done'}
                </button>
              ) : !c.ok ? (
                <button
                  onClick={() => goToStep(c.step)}
                  className="text-xs font-medium text-[#10B981] hover:text-[#0d9668] inline-flex items-center gap-1"
                >
                  <Link2 className="w-3 h-3" />
                  Fix
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Mode selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shadow mode */}
        <button
          onClick={handleGoShadow}
          className="text-left bg-white rounded-2xl border border-[#ECECE8] p-6 hover:border-[#10B981]/30 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
            <Eye className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900 mb-1">Start in Shadow Mode</h3>
          <p className="text-xs text-stone-400 leading-relaxed mb-4">
            1Stayz writes every message but holds it for your approval before sending. Review at your own pace.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#10B981] group-hover:gap-2 transition-all">
            Start in shadow
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* Live mode */}
        <button
          onClick={handleGoLive}
          disabled={!allGreen}
          className="text-left bg-white rounded-2xl border border-[#ECECE8] p-6 hover:border-[#10B981]/30 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900 mb-1">Go Live</h3>
          <p className="text-xs text-stone-400 leading-relaxed mb-4">
            1Stayz sends messages automatically. You can switch back to shadow mode anytime.
          </p>
          {allGreen ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#10B981] group-hover:gap-2 transition-all">
              Go live now
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="text-xs text-stone-400">Complete all checks to enable</span>
          )}
        </button>
      </div>
    </div>
  );
}
