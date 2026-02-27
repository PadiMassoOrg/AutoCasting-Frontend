import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TALENT_CASTING_APPLICATION_CACHE_KEY, applyToCastingRole } from '../services/castingApplicationService';
import type { CastingApplicationRequest } from '../types/requests';

type Vars = {
  roleId: string;
  request?: CastingApplicationRequest;
};

export const useCastingApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, Vars>({
    mutationFn: ({ roleId, request }) => applyToCastingRole(roleId, request),

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...TALENT_CASTING_APPLICATION_CACHE_KEY, variables.roleId],
      });
    },
  });
};
