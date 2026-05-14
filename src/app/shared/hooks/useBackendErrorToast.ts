import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';

export function useBackendErrorToast(dedupeMs = 500) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const lastToastRef = useRef<{ message: string; at: number } | null>(null);

  return (message: string) => {
    const now = Date.now();
    const lastToast = lastToastRef.current;

    if (lastToast && lastToast.message === message && now - lastToast.at < dedupeMs) {
      return;
    }

    lastToastRef.current = { message, at: now };
    showToast({
      title: t('general.error'),
      description: message,
      type: 'danger',
    });
  };
}
