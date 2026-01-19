import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCasting, EMPLOYER_CASTINGS_LIST_CACHE_KEY } from '../services/employerCastingService';

export const useDeleteCastingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, any, { id: string }>({
    mutationFn: ({ id }) => deleteCasting({ id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: EMPLOYER_CASTINGS_LIST_CACHE_KEY });
    },
  });
};
