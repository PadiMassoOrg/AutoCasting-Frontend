import {
  ToastProvider as LibraryToastProvider,
  useToast as useLibraryToast,
  type ShowToastOptions,
} from 'autocasting-ui-library-padimasso';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

type ToastContextType = {
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function ToastContextBridge({ children }: { children: ReactNode }) {
  const { showToast, dismissToast, clearToasts } = useLibraryToast();

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
      clearToasts,
    }),
    [clearToasts, dismissToast, showToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <LibraryToastProvider>
      <ToastContextBridge>{children}</ToastContextBridge>
    </LibraryToastProvider>
  );
}

export type { ShowToastOptions, ToastPosition, ToastType } from 'autocasting-ui-library-padimasso';
