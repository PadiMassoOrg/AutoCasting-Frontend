import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EMPLOYER_PROFILE_CACHE_KEY, patchEmployerBasicInfo } from '../services/employerProfileService';
import type { EmployerProfileBasicInfo } from '../types/employerProfile.types';
import type { EmployerBasicInfoPatchRequest } from '../types/requests';

export const usePatchEmployerBasicInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EmployerProfileBasicInfo, unknown, EmployerBasicInfoPatchRequest>({
    mutationFn: patchEmployerBasicInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYER_PROFILE_CACHE_KEY });
    },
  });
};
