import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TALENT_PROFILE_CACHE_KEY, patchMedia } from '../services/talentProfileService';
import type { MediaPatchRequest } from '../types/requests';
import type { Media, TalentProfileResponse } from '../types/talentProfile.types';

export const usePatchTalentMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Media, any, MediaPatchRequest>({
    mutationFn: patchMedia,
    onSuccess: (updatedMedia) => {
      queryClient.setQueriesData(
        { queryKey: TALENT_PROFILE_CACHE_KEY, exact: false },
        (prev: TalentProfileResponse | undefined) =>
          prev
            ? {
                ...prev,
                media: updatedMedia,
                modifiedAt: updatedMedia.modifiedAt ?? prev.modifiedAt,
              }
            : prev
      );
    },
  });
};
