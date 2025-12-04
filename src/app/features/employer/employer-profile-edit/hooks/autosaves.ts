import { useSectionAutosave } from '../../../talent/talent-profile-edit/hooks/useSectionAutoSave';
import { EMPLOYER_PROFILE_CACHE_KEY, patchEmployerBasicInfo } from '../services/employerProfileService';
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
