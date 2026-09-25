import type { MeDataResponse } from '../../auth/types/auth.types';
import type { ProposalRequirementCode } from '../types/proposals.types';

const REQUIREMENT_CHECKS: Record<ProposalRequirementCode, (me: MeDataResponse) => boolean> = {
  EMPLOYER_ONBOARDING_COMPLETED: (me) => me.employerOnboardingStatus === 'COMPLETED',
};

export const isProposalRequirementSatisfied = (code: ProposalRequirementCode, me: MeDataResponse) =>
  REQUIREMENT_CHECKS[code]?.(me) ?? false;
