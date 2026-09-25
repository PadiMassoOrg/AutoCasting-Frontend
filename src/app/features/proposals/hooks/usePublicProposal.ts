import { useQuery } from '@tanstack/react-query';
import { getProposal, PUBLIC_PROPOSAL_CACHE_KEY } from '../services/proposalsService';
import type { PublicProposalResponse } from '../types/proposals.types';

export const usePublicProposal = (token: string | undefined, enabled: boolean) =>
  useQuery<PublicProposalResponse>({
    queryKey: [...PUBLIC_PROPOSAL_CACHE_KEY, token ?? 'no-token'],
    queryFn: ({ signal }) => getProposal(token!, signal),
    enabled: !!token && enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 0,
    meta: { survivesLogout: true },
  });
