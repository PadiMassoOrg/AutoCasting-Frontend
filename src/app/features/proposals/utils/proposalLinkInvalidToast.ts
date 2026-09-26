import type { ShowToastOptions } from 'autocasting-ui-library-padimasso';
import type { TFunction } from 'i18next';
import { getBackendErrorStatus } from '../../../shared/utils/backendErrorHandling';

export const isProposalLinkInvalidError = (error: unknown) => {
  const status = getBackendErrorStatus(error);
  return status === 410 || status === 404;
};

export const proposalLinkInvalidToast = (t: TFunction): ShowToastOptions => ({
  title: t('general.warning'),
  description: t('proposals.link_invalid'),
  type: 'warning',
  durationMs: 10000,
});
