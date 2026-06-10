import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getBackendErrorPayload, handleBackendActionError } from '../../../shared/utils/backendErrorHandling';
import { PUBLIC_CASTING_DETAILS_CACHE_KEY } from '../../public-casting/services/castingDetailsService';
import { TALENT_CASTING_APPLICATION_CACHE_KEY, applyToCastingRole } from '../services/castingApplicationService';
import type { CastingApplicationRequest } from '../types/requests';

type Vars = {
  roleId: string;
  slug: string;
  request?: CastingApplicationRequest;
};

type UseCastingApplicationMutationOptions = {
  onProfileMediaRequiredForApplication?: () => void;
};

export const useCastingApplicationMutation = (options?: UseCastingApplicationMutationOptions) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, unknown, Vars>({
    mutationFn: ({ roleId, request }) => applyToCastingRole(roleId, request),

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...TALENT_CASTING_APPLICATION_CACHE_KEY, variables.roleId],
      });
      await queryClient.invalidateQueries({
        queryKey: [...PUBLIC_CASTING_DETAILS_CACHE_KEY, variables.slug, variables.roleId],
      });
    },
    onError: (error) => {
      const payload = getBackendErrorPayload(error);
      if (payload.message?.message === 'profile.media.required_for_application') {
        options?.onProfileMediaRequiredForApplication?.();
        return;
      }

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
