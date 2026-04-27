import { Button, Modal, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { useAuthToken } from '../../../features/auth/hooks/useAuthToken';
import { acceptCurrentLegalDocuments } from '../../../features/auth/services/authService';
import api from '../../../shared/lib/axios';
import { forceLogoutRedirect } from '../../../shared/lib/authSession';
import { getAuthToken } from '../../../shared/lib/cookies';
import { registerLegalAcceptanceHandler, requestLegalAcceptance } from '../../../shared/lib/legalAcceptanceGate';
import { API_ROUTES, ROUTES } from '../../../shared/lib/routes';

const LEGAL_REQUIREMENTS_CACHE_TTL_MS = 60_000; // 60s en memoria por sesión

type LegalAcceptanceModalProps = {
  onAccepted: () => void;
  onCancel: () => void;
  onReadTerms: () => void;
  onReadPrivacy: () => void;
  isLoggingOut: boolean;
};

const LegalAcceptanceRequiredModal = ({
  onAccepted,
  onCancel,
  onReadTerms,
  onReadPrivacy,
  isLoggingOut,
}: LegalAcceptanceModalProps) => {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isBusy = isSubmitting || isLoggingOut;

  const handleAccept = async () => {
    if (isBusy) return;

    const token = getAuthToken();
    if (!token) {
      onCancel();
      return;
    }

    setIsSubmitting(true);
    try {
      await acceptCurrentLegalDocuments(token, i18n.language ?? 'es');
      onAccepted();
    } catch {
      showToast({
        title: t('general.error'),
        description: t('legal.acceptance_required_modal.accept_error'),
        type: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="flex flex-col gap-4">
      <p className="text-base">{t('legal.acceptance_required_modal.description')}</p>
      <h2 className="text-xs font-light">
        {t('auth.page.disclaimer_terms_login')}{' '}
        <a
          href={ROUTES.TERMS}
          target="_blank"
          className="font-semibold text-[var(--color-primary-purple)]"
          onClick={(e) => {
            e.preventDefault();
            onReadTerms();
          }}
        >
          {t('legal.short_terms')}
        </a>{' '}
        {t('general.and')}{' '}
        <a
          href={ROUTES.PRIVACY}
          target="_blank"
          className="font-semibold text-[var(--color-primary-purple)]"
          onClick={(e) => {
            e.preventDefault();
            onReadPrivacy();
          }}
        >
          {t('legal.short_privacy')}
        </a>
      </h2>
      <Separator className="opacity-20 my-2" />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isBusy}>
          {isLoggingOut ? t('state.loading') : t('buttons.cancel')}
        </Button>
        <Button onClick={handleAccept} disabled={isBusy}>
          {isSubmitting ? t('state.loading') : t('legal.acceptance_required_modal.accept_button')}
        </Button>
      </div>
    </article>
  );
};

export default function LegalAcceptanceRequiredGate() {
  const { t } = useTranslation();
  const location = useLocation();
  const token = useAuthToken();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const resolverRef = useRef<((accepted: boolean) => void) | null>(null);
  const legalCheckInFlightRef = useRef(false);
  const legalRequirementsCacheRef = useRef<{ acceptedCurrent: boolean; checkedAt: number } | null>(null);

  const resolveAndClose = (accepted: boolean) => {
    resolverRef.current?.(accepted);
    resolverRef.current = null;
    setIsOpen(false);
    setIsLoggingOut(false);
    if (accepted) {
      legalRequirementsCacheRef.current = {
        acceptedCurrent: true,
        checkedAt: Date.now(),
      };
    }
  };

  const handleCancelAndLogout = () => {
    if (isLoggingOut) return;

    // Libera la request original en interceptor, pero mantiene el modal visible
    // hasta que el redirect de logout ocurra efectivamente.
    resolverRef.current?.(false);
    resolverRef.current = null;
    setIsLoggingOut(true);
    forceLogoutRedirect();
  };

  const handleReadTerms = () => {
    if (isLoggingOut) return;
    window.open(ROUTES.TERMS, '_blank', 'noopener,noreferrer');
  };

  const handleReadPrivacy = () => {
    if (isLoggingOut) return;
    window.open(ROUTES.PRIVACY, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const unregister = registerLegalAcceptanceHandler(() => {
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
        setIsLoggingOut(false);
        setIsOpen(true);
      });
    });

    return () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
      unregister();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const runProactiveLegalCheck = async () => {
      if (!token || isLoggingOut) return;
      if (!location.pathname.startsWith(ROUTES.DASHBOARD)) return;
      if (legalCheckInFlightRef.current) return;
      if (isOpen) return;

      const cache = legalRequirementsCacheRef.current;
      if (
        cache &&
        cache.acceptedCurrent === true &&
        Date.now() - cache.checkedAt < LEGAL_REQUIREMENTS_CACHE_TTL_MS
      ) {
        return;
      }

      try {
        legalCheckInFlightRef.current = true;
        const { data } = await api.get<{ acceptedCurrent?: boolean }>(API_ROUTES.LEGAL_REQUIREMENTS, {
          params: { locale: 'es' },
        });

        if (cancelled) return;
        legalRequirementsCacheRef.current = {
          acceptedCurrent: data?.acceptedCurrent === true,
          checkedAt: Date.now(),
        };
        if (data?.acceptedCurrent === false) {
          void requestLegalAcceptance();
        }
      } catch {
        // noop: existing request-level 428 handling remains source of truth.
      } finally {
        legalCheckInFlightRef.current = false;
      }
    };

    const onWindowFocus = () => {
      void runProactiveLegalCheck();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void runProactiveLegalCheck();
      }
    };

    const intervalId = window.setInterval(() => {
      void runProactiveLegalCheck();
    }, 15000);

    window.addEventListener('focus', onWindowFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    void runProactiveLegalCheck();

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onWindowFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [location.pathname, token, isLoggingOut, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleCancelAndLogout} title={t('legal.acceptance_required_modal.title')} size="lg">
      <LegalAcceptanceRequiredModal
        onAccepted={() => resolveAndClose(true)}
        onCancel={handleCancelAndLogout}
        onReadTerms={handleReadTerms}
        onReadPrivacy={handleReadPrivacy}
        isLoggingOut={isLoggingOut}
      />
    </Modal>
  );
}
