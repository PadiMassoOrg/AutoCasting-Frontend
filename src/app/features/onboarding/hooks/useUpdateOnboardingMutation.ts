import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { handleBackendActionError } from '../../../shared/utils/backendErrorHandling';
import { ME_DATA_CACHE_KEY } from '../../auth/services/authService';
import type { MeDataResponse } from '../../auth/types/auth.types';
import { patchUserOnboarding } from '../services/onboardingService';
import type { UserOnboardingRequest } from '../types/onboarding.types';

export const useUpdateOnboardingMutation = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<MeDataResponse, any, UserOnboardingRequest>({
    mutationFn: (payload: UserOnboardingRequest) => patchUserOnboarding(payload),
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: ME_DATA_CACHE_KEY }, data);
      queryClient.invalidateQueries({ queryKey: ME_DATA_CACHE_KEY });
    },
    onError: (error) => {
      handleBackendActionError({
        error,
        t,
        showToast: (message) =>
          showToast({
            title: t('general.error'),
            description: message,
            type: 'danger',
          }),
      });
    },
  });
};
