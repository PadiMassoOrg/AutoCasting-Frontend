import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '../../../../auth/hooks/useAuthToken';
import { CASTING_SECTION_CHECKOUT_CACHE_KEY, getSectionCheckoutSummary } from '../../services/employerCastingService';
import type { CastingSectionCheckout } from '../../types/employerCastings.types';

export const useSectionCheckout = (id?: string) => {
  const token = useAuthToken();

  return useQuery<CastingSectionCheckout>({
    queryKey: [...CASTING_SECTION_CHECKOUT_CACHE_KEY, id ?? 'no-id', token ?? 'no-token'],
    queryFn: () => getSectionCheckoutSummary(id!),
    enabled: !!id && !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
