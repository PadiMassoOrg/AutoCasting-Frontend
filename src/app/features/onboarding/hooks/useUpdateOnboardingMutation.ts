import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ME_DATA_CACHE_KEY } from '../../auth/services/authService';
import { patchUserOnboarding } from '../services/onboardingService';
import type { UserOnboardingRequest } from '../types/onboarding.types';

export const useUpdateOnboardingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserOnboardingRequest) => patchUserOnboarding(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ME_DATA_CACHE_KEY });
    },
  });
};
