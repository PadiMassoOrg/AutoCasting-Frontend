import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useBackendErrorToast } from '../../../../shared/hooks/useBackendErrorToast';
import { handleBackendActionError } from '../../../../shared/utils/backendErrorHandling';
import { duplicateCastingRole, EMPLOYER_CASTING_EDITOR_CACHE_KEY } from '../services/employerCastingService';
import type { CastingRoleResponse } from '../types/employerCastings.types';

export const useDuplicateCastingRoleMutation = (slug?: string) => {
  const { t } = useTranslation();
  const showErrorToast = useBackendErrorToast();
  const queryClient = useQueryClient();

  return useMutation<CastingRoleResponse, unknown, { roleId: string; roleName?: string }>({
    mutationFn: ({ roleId, roleName }) => duplicateCastingRole({ roleId, roleName }),
    onSuccess: async () => {
      if (slug) {
        await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_EDITOR_CACHE_KEY, slug] });
      }
    },
    onError: (error) => {
      handleBackendActionError({
        error,
        t,
        showToast: showErrorToast,
      });
    },
  });
};
