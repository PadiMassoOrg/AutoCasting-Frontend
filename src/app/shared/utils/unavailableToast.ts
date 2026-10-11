import type { TFunction } from 'i18next';
import type { ShowToastOptions } from '../../context/ToastContext';

// Shown when a public resource opened from a link or a list no longer exists (backend 404).
export const unavailableToast = (t: TFunction, messageKey: string): ShowToastOptions => ({
  title: t('state.no_results'),
  description: t(messageKey),
  type: 'warning',
  durationMs: 7000,
  closable: true,
});
