import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../../shared/lib/cookies';
import { CASTING_SECTION_CHECKOUT_CACHE_KEY, getSectionCheckoutSummary } from '../../services/employerCastingService';
import type { CastingSectionCheckout } from '../../types/employerCastings.types';

export const useSectionCheckout = (id?: string) => {
  const token = getAuthToken();

  return useQuery<CastingSectionCheckout>({
    queryKey: [...CASTING_SECTION_CHECKOUT_CACHE_KEY, id ?? 'no-id', token ?? 'no-token'],
    queryFn: () => getSectionCheckoutSummary(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
