import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import { getBackendErrorStatus } from '../../../shared/utils/backendErrorHandling';
import type { ProposalClaimResult, PublicProposalResponse } from '../types/proposals.types';

export const PUBLIC_PROPOSAL_CACHE_KEY = ['cache-public-proposal'] as const;

export const getProposal = async (token: string, signal?: AbortSignal): Promise<PublicProposalResponse> => {
  const { data } = await api.get<PublicProposalResponse>(API_ROUTES.PROPOSAL(token), { signal });
  return data;
};

export const attachProposal = async (token: string): Promise<void> => {
  await api.post(API_ROUTES.PROPOSAL_ATTACH(token));
};

export const claimProposal = async (token: string): Promise<ProposalClaimResult> => {
  const { data } = await api.post<ProposalClaimResult>(API_ROUTES.PROPOSAL_CLAIM(token));
  return data;
};

export const getProposalClaimResult = async (token: string): Promise<ProposalClaimResult> => {
  const { data } = await api.get<ProposalClaimResult>(API_ROUTES.PROPOSAL_CLAIM_RESULT(token));
  return data;
};

export const claimOrGetClaimResult = async (token: string): Promise<ProposalClaimResult> => {
  try {
    return await claimProposal(token);
  } catch (error) {
    if (getBackendErrorStatus(error) === 410) return getProposalClaimResult(token);
    throw error;
  }
};
