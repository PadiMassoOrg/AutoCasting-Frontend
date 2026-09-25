import type { ShowToastOptions } from 'autocasting-ui-library-padimasso';
import type { TFunction } from 'i18next';
import { ROUTES } from '../../../shared/lib/routes';
import type { ProposalClaimResult } from '../types/proposals.types';

const CASTINGS_DEADLINE_PASSED = 'castings.deadline_passed';

const isPublished = (result: ProposalClaimResult) => result.outcome.published === true;

export const castingProposalRedirectTo = (result: ProposalClaimResult) => {
  const slug = result.associated[0]?.slug;
  if (isPublished(result) || !slug) return ROUTES.EMPLOYER_CASTINGS;
  return `${ROUTES.EMPLOYER_CASTING}/${slug}/editor`;
};

export const castingProposalSuccessToast = (result: ProposalClaimResult, t: TFunction): ShowToastOptions => {
  const description = isPublished(result)
    ? t('proposals.casting.claimed_published')
    : result.outcome.reason === CASTINGS_DEADLINE_PASSED
      ? t('proposals.casting.claimed_draft_deadline')
      : t('proposals.casting.claimed_draft');

  return { title: t('proposals.casting.claimed_title'), description, type: 'success', durationMs: 10000 };
};
