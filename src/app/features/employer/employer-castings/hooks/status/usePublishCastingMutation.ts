import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EMPLOYER_CASTINGS_LIST_CACHE_KEY,
  EMPLOYER_CASTING_CACHE_KEY,
  publishCasting,
} from '../../services/employerCastingService';
import type { EmployerCastingResponse } from '../../types/employerCastings.types';

export const usePublishCastingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EmployerCastingResponse, any, { id: string; slug?: string }>({
    mutationFn: ({ id }) => publishCasting({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYER_CASTINGS_LIST_CACHE_KEY });
      if (variables.slug) {
        await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_CACHE_KEY, variables.slug] });
      }
    },
  });
};
