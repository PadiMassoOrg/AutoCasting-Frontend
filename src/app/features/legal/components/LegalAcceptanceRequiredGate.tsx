import { Button, Modal, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { acceptCurrentLegalDocuments } from '../../../features/auth/services/authService';
import { forceLogoutRedirect } from '../../../shared/lib/authSession';
import { getAuthToken } from '../../../shared/lib/cookies';
import { registerLegalAcceptanceHandler } from '../../../shared/lib/legalAcceptanceGate';
import { ROUTES } from '../../../shared/lib/routes';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const resolverRef = useRef<((accepted: boolean) => void) | null>(null);

  const resolveAndClose = (accepted: boolean) => {
    resolverRef.current?.(accepted);
    resolverRef.current = null;
    setIsOpen(false);
    setIsLoggingOut(false);
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
