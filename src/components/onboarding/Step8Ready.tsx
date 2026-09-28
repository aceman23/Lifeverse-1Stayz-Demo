import { useOnboarding } from '../../lib/onboarding-context';
import { CheckCircle2, AlertTriangle, Clock, Eye, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Step8Ready() {
  const { state, update } = useOnboarding();
  const navigate = useNavigate();

  const checks = [
    { key: 'church', label: 'Church profile complete', ok: state.church.name.trim() !== '' && state.church.yourName.trim() !== '' },
    { key: 'schedule', label: 'Service schedule configured', ok: state.serviceSchedule.length > 0 && state.serviceSchedule.every((s) => s.name.trim() !== '') },
    { key: 'needs', label: 'Needs selected', ok: state.needs.length > 0 || state.otherNeed.trim() !== '' },
    { key: 'guardrails', label: 'Guardrails configured', ok: state.doctrinalPositions.length > 0 },
    { key: 'team', label: 'Team & escalation order set', ok: state.staff.length > 0 && state.staff.some((s) => s.receivesEscalations) },
    { key: 'message', label: 'First message approved', ok: state.firstMessageApproved },
  ];

  const allGreen = checks.every((c) => c.ok);
  const amberCount = checks.filter((c) => !c.ok).length;

  function handleGoShadow() {
    update({ mode: 'shadow', completed: true });
    navigate('/');
  }

  function handleGoLive() {
    update({ mode: 'live', completed: true });
    navigate('/');
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
            <div key={c.key} className="flex items-center gap-3 p-3 rounded-lg">
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
              {!c.ok && (
                <span className="text-xs text-amber-600 font-medium">Needs attention</span>
              )}
            </div>
          ))}
        </div>
        {amberCount > 0 && (
          <div className="flex items-start gap-2.5 mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              {amberCount} item{amberCount > 1 ? 's' : ''} need attention. You can still start in shadow mode and fix them later.
            </p>
          </div>
        )}
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
          <h3 className="text-sm font-semibold text-stone-900 mb-1">Shadow Mode</h3>
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
