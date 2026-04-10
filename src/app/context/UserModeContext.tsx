import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { USER_MODE_STORAGE_KEY } from '../shared/lib/storageKeys';

export type UserMode = 'talent' | 'employer';

type UserModeContextValue = {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
};

const UserModeContext = createContext<UserModeContextValue | undefined>(undefined);

export const USER_MODE_TALENT = 'talent';
export const USER_MODE_EMPLOYER = 'employer';

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>(USER_MODE_TALENT);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(USER_MODE_STORAGE_KEY) as UserMode | null;
      if (stored === USER_MODE_TALENT || stored === USER_MODE_EMPLOYER) {
        setModeState(stored);
      }
    } catch {
      // si falla localStorage, seguimos con el default
    }
  }, []);

  const setMode = (next: UserMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(USER_MODE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const toggleMode = () => {
    setMode(mode === USER_MODE_TALENT ? USER_MODE_EMPLOYER : USER_MODE_TALENT);
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
