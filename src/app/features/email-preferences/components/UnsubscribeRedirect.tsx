import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { ROUTES } from '../../../shared/lib/routes';
import { unsubscribeFromEmails } from '../services/emailPreferencesService';

// Target of the unsubscribe link in marketing emails: sends the user home right away and toasts the result.
const UnsubscribeRedirect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { token } = useParams<{ token: string }>();
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    navigate(ROUTES.HOME, { replace: true });
    if (!token) return;

    unsubscribeFromEmails(token)
      .then(() =>
        showToast({
          title: t('email_preferences.unsubscribed_title'),
          description: t('email_preferences.unsubscribed'),
          type: 'success',
          durationMs: 10000,
        })
      )
      .catch(() =>
        showToast({
          title: t('general.warning'),
          description: t('email_preferences.link_invalid'),
          type: 'warning',
          durationMs: 10000,
        })
      );
  }, [navigate, showToast, t, token]);

  return null;
};

export default UnsubscribeRedirect;
