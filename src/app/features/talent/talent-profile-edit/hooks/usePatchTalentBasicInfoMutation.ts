// src/app/features/talent/talent-profile-edit/hooks/usePatchBasicInfoMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchBasicInfo, TALENT_PROFILE_CACHE_KEY } from '../services/talentProfileService';
import type { BasicInfoPatchRequest } from '../types/requests';
import type { TalentProfileBasicInfo } from '../types/talentProfile.types';

export const usePatchTalentBasicInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TalentProfileBasicInfo, unknown, BasicInfoPatchRequest>({
    mutationFn: patchBasicInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TALENT_PROFILE_CACHE_KEY });
    },
  });
};
