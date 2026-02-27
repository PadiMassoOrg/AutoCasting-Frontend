import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  return useMutation<EmployerCastingEditorResponse, unknown, Vars>({
    mutationFn: ({ id }) => mutationByAction[action]({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYER_CASTINGS_LIST_CACHE_KEY });

      if (variables.slug) {
        await queryClient.invalidateQueries({
          queryKey: [...EMPLOYER_CASTING_CACHE_KEY, variables.slug],
        });
      }
    },
  });
};
