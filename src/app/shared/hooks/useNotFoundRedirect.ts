import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { isBackendNotFoundError } from '../utils/backendErrorHandling';

// When a public resource is no longer available (backend 404), send the visitor to `to` with an error
// toast instead of rendering an error page. Returns true while redirecting so the page renders nothing.
// Other errors are left to the page (e.g. ServerErrorPage), since the resource may still exist.
export const useNotFoundRedirect = (error: unknown, to: string, messageKey: string): boolean => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isNotFound = !!error && isBackendNotFoundError(error);

  useEffect(() => {
    if (!isNotFound) return;
    showToast({ title: t('general.error'), description: t(messageKey), type: 'danger' });
    navigate(to, { replace: true });
  }, [isNotFound, messageKey, navigate, showToast, t, to]);

  return isNotFound;
};
