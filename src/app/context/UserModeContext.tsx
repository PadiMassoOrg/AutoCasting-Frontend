import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type UserMode = 'talent' | 'employer';

type UserModeContextValue = {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
};

const UserModeContext = createContext<UserModeContextValue | undefined>(undefined);

const MODE_STORAGE_KEY = 'autocasting:user-mode';

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>('talent');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MODE_STORAGE_KEY) as UserMode | null;
      if (stored === 'talent' || stored === 'employer') {
        setModeState(stored);
      }
    } catch {
      // si falla localStorage, seguimos con el default
    }
  }, []);

  const setMode = (next: UserMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const toggleMode = () => {
    setMode(mode === 'talent' ? 'employer' : 'talent');
  };

  const value: UserModeContextValue = { mode, setMode, toggleMode };

  return <UserModeContext.Provider value={value}>{children}</UserModeContext.Provider>;
}

export function useUserMode() {
  const ctx = useContext(UserModeContext);
  if (!ctx) {
    throw new Error('useUserMode must be used within ModeProvider');
  }
  return ctx;
}
