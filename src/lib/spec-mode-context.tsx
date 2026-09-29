import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const STORAGE_KEY = '1stayz_spec_mode';

interface SpecModeContextValue {
  specMode: boolean;
  toggle: () => void;
  setSpecMode: (v: boolean) => void;
  activeSpecId: string | null;
  setActiveSpecId: (id: string | null) => void;
  registeredIds: string[];
  registerId: (id: string) => void;
  unregisterId: (id: string) => void;
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
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

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

  const registerId = useCallback((id: string) => {
    setRegisteredIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unregisterId = useCallback((id: string) => {
    setRegisteredIds((prev) => prev.filter((x) => x !== id));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        return;
      }
      if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        setSpecMode(!specMode);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [specMode]);

  return (
    <SpecModeContext.Provider value={{ specMode, toggle, setSpecMode, activeSpecId, setActiveSpecId, registeredIds, registerId, unregisterId }}>
      {children}
    </SpecModeContext.Provider>
  );
}

export function useSpecMode() {
  const ctx = useContext(SpecModeContext);
  if (!ctx) throw new Error('useSpecMode must be used within SpecModeProvider');
  return ctx;
}
