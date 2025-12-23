import { useSectionAutosave } from '../../../talent/talent-profile-edit/hooks/useSectionAutoSave';
import { EMPLOYER_CASTING_CACHE_KEY, patchCastingBasicInfo } from '../services/employerCastingService';
import type { CastingBasicInfo, CastingResponse } from '../types/employerCastings.types';
import type { CastingBasicInfoPatchRequest } from '../types/requests';

export function useCastingBasicInfoAutosave() {
  return useSectionAutosave<CastingBasicInfoPatchRequest, CastingBasicInfo>({
    mutationFn: patchCastingBasicInfo,
    delay: 800,
    onSuccessUpdate: (prev: CastingResponse, updated) => ({ ...prev, basicInfo: updated }),
    cacheKeys: [EMPLOYER_CASTING_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}
