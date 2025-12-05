import { useSectionAutosave } from '../../../talent/talent-profile-edit/hooks/useSectionAutoSave';
import type { SocialMediaPatchRequest } from '../../../talent/talent-profile-edit/types/requests';
import type { ProfileSocialMedia } from '../../../talent/talent-profile-edit/types/talentProfile.types';
import {
  EMPLOYER_PROFILE_CACHE_KEY,
  patchEmployerBasicInfo,
  patchEmployerSocialMedia,
} from '../services/employerProfileService';
import type { EmployerProfileBasicInfo, EmployerProfileResponse } from '../types/employerProfile.types';
import type { EmployerBasicInfoPatchRequest } from '../types/requests';

export function useEmployerBasicInfoAutosave() {
  return useSectionAutosave<EmployerBasicInfoPatchRequest, EmployerProfileBasicInfo>({
    mutationFn: patchEmployerBasicInfo,
    delay: 800,
    onSuccessUpdate: (prev: EmployerProfileResponse, updated) => ({ ...prev, basicInfo: updated }),
    cacheKeys: [EMPLOYER_PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useEmployerSocialMediaAutosave() {
  return useSectionAutosave<SocialMediaPatchRequest, ProfileSocialMedia>({
    mutationFn: patchEmployerSocialMedia,
    delay: 400,
    cacheKeys: [EMPLOYER_PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
    onSuccessUpdate: (prev: EmployerProfileResponse, updated) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        socialMedia: updated,
      },
    }),
  });
}
