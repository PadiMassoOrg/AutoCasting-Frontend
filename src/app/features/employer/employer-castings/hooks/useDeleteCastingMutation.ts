import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useBackendErrorToast } from '../../../../shared/hooks/useBackendErrorToast';
import { handleBackendActionError } from '../../../../shared/utils/backendErrorHandling';
import { deleteCasting, EMPLOYER_CASTINGS_LIST_CACHE_KEY } from '../services/employerCastingService';

export const useDeleteCastingMutation = () => {
  const { t } = useTranslation();
  const showErrorToast = useBackendErrorToast();
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, any, { id: string }>({
    mutationFn: ({ id }) => deleteCasting({ id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYER_CASTINGS_LIST_CACHE_KEY });
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
