import { useQuery } from '@tanstack/react-query';
import { getEmployerCastingCheckoutSummary } from '../services/employerCastingService';
import type { EmployerCastingCheckoutSummaryResponse } from '../types/employerCastings.types';

export const useEmployerCastingCheckoutSummary = (castingId?: string | null) => {
  return useQuery<EmployerCastingCheckoutSummaryResponse>({
    queryKey: ['cache-employer-casting-checkout-summary', castingId],
    queryFn: () => getEmployerCastingCheckoutSummary(castingId!),
    enabled: !!castingId,
  });
};
