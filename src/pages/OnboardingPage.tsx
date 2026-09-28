import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../lib/onboarding-context';
import { STEP_LABELS, COACH_CONTENT } from '../data/onboarding';
import { ArrowLeft, ArrowRight, X, Info } from 'lucide-react';
import { Step1Church } from '../components/onboarding/Step1Church';
import { Step2Reading } from '../components/onboarding/Step2Reading';
import { Step3Needs } from '../components/onboarding/Step3Needs';
import { Step4Systems } from '../components/onboarding/Step4Systems';
import { Step5Guardrails } from '../components/onboarding/Step5Guardrails';
import { Step6Team } from '../components/onboarding/Step6Team';
import { Step7Message } from '../components/onboarding/Step7Message';
import { Step8Ready } from '../components/onboarding/Step8Ready';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { state, nextStep, prevStep, goToStep, saveAndExit } = useOnboarding();
  const [coachOpen, setCoachOpen] = useState(true);

  const step = state.currentStep;
  const canContinue = checkCanContinue(step, state);

  function handleSaveExit() {
    saveAndExit();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#F6F6F3]">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#ECECE8]">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          {/* Logo */}
          <img
            src="/LVHI_1Stayz.png"
            alt="1Stayz"
            className="h-auto w-auto object-contain brightness-0"
            style={{ height: '2rem' }}
          />
          <button
            onClick={handleSaveExit}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors inline-flex items-center gap-1.5"
          >
            Save & exit
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="px-4 md:px-6 pb-3">
          <div className="flex items-center gap-1">
            {STEP_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className="flex-1 group"
              >
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    i <= step ? 'bg-[#10B981]' : 'bg-stone-200'
                  }`}
                />
                <span
                  className={`text-[10px] mt-1 block text-center transition-colors hidden md:block ${
                    i === step
                      ? 'text-stone-900 font-semibold'
                      : i < step
                        ? 'text-stone-500'
                        : 'text-stone-300'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto flex gap-6">
          {/* Main column */}
          <div className="flex-1 max-w-[720px] mx-auto">
            {step === 0 && <Step1Church />}
            {step === 1 && <Step2Reading />}
            {step === 2 && <Step3Needs />}
            {step === 3 && <Step4Systems />}
            {step === 4 && <Step5Guardrails />}
            {step === 5 && <Step6Team />}
            {step === 6 && <Step7Message />}
            {step === 7 && <Step8Ready />}

            {/* Nav buttons */}
            {step < 7 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-[#1a2e2a] text-white hover:bg-[#245045] disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Coach panel */}
          <div className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-28">
              <button
                onClick={() => setCoachOpen((v) => !v)}
                className="w-full flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3"
              >
                <Info className="w-3.5 h-3.5" />
                Why this matters
              </button>
              {coachOpen && (
                <div className="bg-white rounded-2xl border border-[#ECECE8] p-5">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {COACH_CONTENT[step]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function checkCanContinue(step: number, state: ReturnType<typeof useOnboarding>['state']): boolean {
  switch (step) {
    case 0:
      return state.church.name.trim() !== '' && state.church.yourName.trim() !== '' && state.church.yourRole !== '';
    case 1:
      return state.serviceSchedule.length > 0 && state.serviceSchedule.every(
        (s) => s.name.trim() !== '' && s.day !== '' && s.startTime !== '' && s.endTime !== ''
      );
    case 2:
      return state.needs.length > 0 || state.otherNeed.trim() !== '';
    case 3:
      return true; // can skip
    case 4:
      return state.doctrinalPositions.length > 0;
    case 5:
      return state.staff.length > 0 && state.staff.some((s) => s.receivesEscalations);
    case 6:
      return state.firstMessageApproved;
    default:
      return true;
  }
}
