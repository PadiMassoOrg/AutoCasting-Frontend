import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../context/ToastContext';
import { handleBackendActionError } from '../../../../shared/utils/backendErrorHandling';
import {
  deleteCastingRole,
  EMPLOYER_CASTING_EDITOR_CACHE_KEY,
  EMPLOYER_CASTING_ROLE_CACHE_KEY,
} from '../services/employerCastingService';

export const useDeleteCastingRoleMutation = (slug?: string) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ roleId: string }, unknown, { roleId: string }>({
    mutationFn: ({ roleId }) => deleteCastingRole({ roleId }),
    onSuccess: async ({ roleId }) => {
      if (slug) {
        await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_EDITOR_CACHE_KEY, slug] });
      }
      await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_ROLE_CACHE_KEY, roleId] });
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
