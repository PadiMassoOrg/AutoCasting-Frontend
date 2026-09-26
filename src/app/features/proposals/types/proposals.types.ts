export type ProposalRequirementCode = 'EMPLOYER_ONBOARDING_COMPLETED';

export type ProposalRequirement = {
  code: ProposalRequirementCode;
  requiredMode: 'TALENT' | 'EMPLOYER';
};

export type PublicProposalResponse = {
  typeCode: string;
  requirement: ProposalRequirement;
  preview: unknown;
};

export type ProposalAssociatedEntity = {
  entityType: string;
  id: string;
  slug: string | null;
};

export type ProposalClaimResult = {
  typeCode: string;
  associated: ProposalAssociatedEntity[];
  outcome: Record<string, unknown>;
};

export type PendingProposal = {
  token: string;
  typeCode: string;
  requirement: ProposalRequirement;
  savedAt: number;
};
