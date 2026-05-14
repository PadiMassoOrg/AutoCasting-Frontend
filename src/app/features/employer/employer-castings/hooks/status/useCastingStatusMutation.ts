import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useBackendErrorToast } from '../../../../../shared/hooks/useBackendErrorToast';
import { handleBackendActionError } from '../../../../../shared/utils/backendErrorHandling';
import {
  EMPLOYER_CASTINGS_LIST_CACHE_KEY,
  EMPLOYER_CASTING_CACHE_KEY,
  archiveCasting,
  closeCasting,
  pauseCasting,
  publishCasting,
  setDraftCasting,
} from '../../services/employerCastingService';
import type { EmployerCastingEditorResponse } from '../../types/employerCastings.types';

export type CastingStatusAction = 'publish' | 'draft' | 'pause' | 'close' | 'archive';

type Vars = { id: string; slug?: string };

const mutationByAction: Record<CastingStatusAction, (v: { id: string }) => Promise<EmployerCastingEditorResponse>> = {
  publish: publishCasting,
  draft: setDraftCasting,
  pause: pauseCasting,
  close: closeCasting,
  archive: archiveCasting,
};

export const useCastingStatusMutation = (action: CastingStatusAction) => {
  const { t } = useTranslation();
  const showErrorToast = useBackendErrorToast();
  const queryClient = useQueryClient();

  return useMutation<EmployerCastingEditorResponse, unknown, Vars>({
    mutationFn: ({ id }) => mutationByAction[action]({ id }),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYER_CASTINGS_LIST_CACHE_KEY });

      if (variables.slug) {
        queryClient.setQueriesData({ queryKey: [...EMPLOYER_CASTING_CACHE_KEY, variables.slug] }, data);
        await queryClient.invalidateQueries({
          queryKey: [...EMPLOYER_CASTING_CACHE_KEY, variables.slug],
        });
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
