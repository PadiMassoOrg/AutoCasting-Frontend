import { Label } from 'autocasting-ui-library-padimasso';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { ServerErrorPage } from '../../../shared/components/ErrorPage';
import { ROUTES } from '../../../shared/lib/routes';
import { useAuthToken } from '../../auth/hooks/useAuthToken';
import { logoutInPlace } from '../../auth/services/authService';
import { usePublicProposal } from '../hooks/usePublicProposal';
import { clearPendingProposal, savePendingProposal } from '../utils/pendingProposal';
import { isProposalLinkInvalidError, proposalLinkInvalidToast } from '../utils/proposalLinkInvalidToast';
import { PROPOSAL_TYPE_REGISTRY } from '../utils/proposalTypeRegistry';

const ProposalPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { token } = useParams<{ token: string }>();
  const authToken = useAuthToken();
  const { data, error, isLoading } = usePublicProposal(token);
  const definition = data ? PROPOSAL_TYPE_REGISTRY[data.typeCode] : undefined;
  const isInvalidLink = (!!error && isProposalLinkInvalidError(error)) || (!!data && !definition);

  useEffect(() => {
    clearPendingProposal();
  }, []);

  useEffect(() => {
    if (!isInvalidLink) return;
    showToast(proposalLinkInvalidToast(t));
    navigate(ROUTES.HOME, { replace: true });
  }, [isInvalidLink, navigate, showToast, t]);

  if (error && !isInvalidLink) return <ServerErrorPage />;

  const claim = () => {
    if (!data || !token) return;
    if (authToken) logoutInPlace();
    savePendingProposal({
      token,
      typeCode: data.typeCode,
      requirement: data.requirement,
    });
    navigate(ROUTES.AUTH_REGISTER);
  };

  return (
    <main className="min-h-screen w-full min-w-0 bg-(--color-secondary-white) p-6 lg:p-0">
      {!isLoading && data && definition ? (
        <definition.Preview preview={data.preview} onClaim={claim} />
      ) : (
        <Label className="w-full pt-10 flex items-center justify-center text-center text-(--color-secondary-grey-fonts)">
          {t('state.loading')}
        </Label>
      )}
    </main>
  );
};

export default ProposalPage;
