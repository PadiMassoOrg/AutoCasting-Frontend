import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ME_DATA_CACHE_KEY } from '../../auth/services/authService';
import type { MeDataResponse } from '../../auth/types/auth.types';
import { patchUserOnboarding } from '../services/onboardingService';
import type { UserOnboardingRequest } from '../types/onboarding.types';

export const useUpdateOnboardingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<MeDataResponse, any, UserOnboardingRequest>({
    mutationFn: (payload: UserOnboardingRequest) => patchUserOnboarding(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(ME_DATA_CACHE_KEY, data);
      queryClient.invalidateQueries({ queryKey: ME_DATA_CACHE_KEY });
    },
  });
};
