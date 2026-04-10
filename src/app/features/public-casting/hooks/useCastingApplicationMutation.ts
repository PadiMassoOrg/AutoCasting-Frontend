import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { handleBackendActionError } from '../../../shared/utils/backendErrorHandling';
import { PUBLIC_CASTING_DETAILS_CACHE_KEY } from '../../public-casting/services/castingDetailsService';
import { TALENT_CASTING_APPLICATION_CACHE_KEY, applyToCastingRole } from '../services/castingApplicationService';
import type { CastingApplicationRequest } from '../types/requests';

type Vars = {
  roleId: string;
  slug: string;
  request?: CastingApplicationRequest;
};

export const useCastingApplicationMutation = () => {
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
