import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createInitialState, type OnboardingState } from '../data/onboarding';

const STORAGE_KEY = '1stayz_onboarding';

interface OnboardingContextValue {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  saveAndExit: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function loadState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...createInitialState(), ...parsed };
    }
  } catch {
    // ignore
  }
  return createInitialState();
}

function persist(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(loadState);

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, currentStep: Math.min(prev.currentStep + 1, 7) };
      persist(next);
      return next;
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, currentStep: Math.max(prev.currentStep - 1, 0) };
      persist(next);
      return next;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => {
      const next = { ...prev, currentStep: step };
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    persist(fresh);
  }, []);

  const saveAndExit = useCallback(() => {
    persist(state);
  }, [state]);

  return (
    <OnboardingContext.Provider value={{ state, update, nextStep, prevStep, goToStep, reset, saveAndExit }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
