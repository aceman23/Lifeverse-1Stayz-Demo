import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const STORAGE_KEY = '1stayz_spec_mode';

interface SpecModeContextValue {
  specMode: boolean;
  toggle: () => void;
  setSpecMode: (v: boolean) => void;
  activeSpecId: string | null;
  setActiveSpecId: (id: string | null) => void;
}

const SpecModeContext = createContext<SpecModeContextValue | null>(null);

function readInitial(): boolean {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('spec') === '1') return true;
  } catch {
    // ignore
  }
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function SpecModeProvider({ children }: { children: ReactNode }) {
  const [specMode, setSpecModeState] = useState(readInitial);
  const [activeSpecId, setActiveSpecId] = useState<string | null>(null);

  function setSpecMode(v: boolean) {
    setSpecModeState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? '1' : '0');
    } catch {
      // ignore
    }
  }

  function toggle() {
    setSpecMode(!specMode);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        setSpecMode(!specMode);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [specMode]);

  return (
    <SpecModeContext.Provider value={{ specMode, toggle, setSpecMode, activeSpecId, setActiveSpecId }}>
      {children}
    </SpecModeContext.Provider>
  );
}

export function useSpecMode() {
  const ctx = useContext(SpecModeContext);
  if (!ctx) throw new Error('useSpecMode must be used within SpecModeProvider');
  return ctx;
}
