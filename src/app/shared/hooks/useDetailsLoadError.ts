import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import { handleBackendActionError, isBackendNotFoundError } from '../utils/backendErrorHandling';
import { unavailableToast } from '../utils/unavailableToast';
import { useBackendErrorToast } from './useBackendErrorToast';

type Args = {
  error: unknown;
  // Message shown when the resource no longer exists (backend 404), e.g. 'events.unavailable'.
  unavailableMessageKey: string;
  // Closes the details view / pane; memoize it (useCallback).
  onFail: () => void;
};

// Details views and panes opened over a list never render an error inside themselves: a failed load is
// reported with a toast (a friendly "unavailable" one for a 404, the backend error otherwise) and the view
// is closed. Each error is handled once. Returns true while there is an error, so the caller renders nothing.
// Standalone detail pages keep using useNotFoundRedirect.
export const useDetailsLoadError = ({ error, unavailableMessageKey, onFail }: Args): boolean => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const showErrorToast = useBackendErrorToast();
  const handledErrorRef = useRef<unknown>(null);

  useEffect(() => {
    if (!error || handledErrorRef.current === error) return;
    handledErrorRef.current = error;

    if (isBackendNotFoundError(error)) {
      showToast(unavailableToast(t, unavailableMessageKey));
    } else {
      handleBackendActionError({ error, t, showToast: showErrorToast });
    }
    onFail();
  }, [error, onFail, showErrorToast, showToast, t, unavailableMessageKey]);

  return !!error;
};
