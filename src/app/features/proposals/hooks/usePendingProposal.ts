import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { ROUTES } from '../../../shared/lib/routes';
import { useAuthToken } from '../../auth/hooks/useAuthToken';
import { useMeData } from '../../auth/hooks/useMeData';
import { useSessionFromOtherTab } from '../../auth/hooks/useSessionFromOtherTab';
import { ME_DATA_CACHE_KEY } from '../../auth/services/authService';
import { attachProposal, claimOrGetClaimResult } from '../services/proposalsService';
import { clearPendingProposal, readPendingProposal } from '../utils/pendingProposal';
import { isProposalLinkInvalidError, proposalLinkInvalidToast } from '../utils/proposalLinkInvalidToast';
import { isProposalRequirementSatisfied } from '../utils/proposalRequirements';
import { PROPOSAL_TYPE_REGISTRY } from '../utils/proposalTypeRegistry';

export const usePendingProposal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const authToken = useAuthToken();
  const { data: meData } = useMeData();
  const sessionFromOtherTab = useSessionFromOtherTab();
  const handledStepRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authToken || !meData || sessionFromOtherTab || pathname.startsWith(ROUTES.PROPOSAL + '/')) return;

    const pending = readPendingProposal();
    if (!pending) return;

    const satisfied = isProposalRequirementSatisfied(pending.requirement.code, meData);
    const step = `${pending.token}:${satisfied ? 'claim' : 'attach'}`;
    if (handledStepRef.current === step) return;
    handledStepRef.current = step;

    const handleInvalidLink = () => {
      clearPendingProposal();
      showToast(proposalLinkInvalidToast(t));
      navigate(ROUTES.HOME, { replace: true });
    };

    const definition = PROPOSAL_TYPE_REGISTRY[pending.typeCode];
    if (!definition) {
      handleInvalidLink();
      return;
    }

    if (!satisfied) {
      attachProposal(pending.token)
        .then(() => queryClient.invalidateQueries({ queryKey: ME_DATA_CACHE_KEY }))
        .catch((error) => {
          if (isProposalLinkInvalidError(error)) handleInvalidLink();
        });
      return;
    }

    claimOrGetClaimResult(pending.token)
      .then((result) => {
        clearPendingProposal();
        void queryClient.invalidateQueries({ queryKey: ME_DATA_CACHE_KEY });
        navigate(definition.redirectTo(result), { replace: true });
        showToast(definition.successToast(result, t));
      })
      .catch((error) => {
        if (isProposalLinkInvalidError(error)) handleInvalidLink();
      });
  }, [authToken, meData, navigate, pathname, queryClient, sessionFromOtherTab, showToast, t]);
};
