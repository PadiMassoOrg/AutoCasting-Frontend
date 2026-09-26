import type { ShowToastOptions } from 'autocasting-ui-library-padimasso';
import type { TFunction } from 'i18next';
import type { ComponentType } from 'react';
import CastingProposalPreview from '../components/casting/CastingProposalPreview';
import type { ProposalClaimResult } from '../types/proposals.types';
import { castingProposalRedirectTo, castingProposalSuccessToast } from './castingProposal';

type ProposalTypeDefinition = {
  Preview: ComponentType<{ preview: unknown; onClaim: () => void }>;
  redirectTo: (result: ProposalClaimResult) => string;
  successToast: (result: ProposalClaimResult, t: TFunction) => ShowToastOptions;
};

export const PROPOSAL_TYPE_REGISTRY: Record<string, ProposalTypeDefinition> = {
  'sitemetadata.proposal_type.casting': {
    Preview: CastingProposalPreview,
    redirectTo: castingProposalRedirectTo,
    successToast: castingProposalSuccessToast,
  },
};
