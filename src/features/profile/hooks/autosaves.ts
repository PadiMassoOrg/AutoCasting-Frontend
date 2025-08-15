import { useSectionAutosave } from './useSectionAutoSave';
import { patchBasicInfo, patchContact, patchSocialMedia, PROFILE_CACHE_KEY } from '../services/profileService';
import type { BasicInfoPatchRequest, ContactPatchRequest, SocialMediaPatchRequest } from '../types/requests';
import type { ProfileBasicInfo, ProfileContact, ProfileSocialMedia, ProfileResponse } from '../types/profile.types';

export function useBasicInfoAutosave() {
  return useSectionAutosave<BasicInfoPatchRequest, ProfileBasicInfo>({
    mutationFn: patchBasicInfo,
    delay: 800,
    onSuccessUpdate: (prev: ProfileResponse, updated) => ({ ...prev, basicInfo: updated }),
    cacheKeys: [PROFILE_CACHE_KEY], // aquí podrías añadir otras keys si las tuvieras
    invalidateOnSuccess: 'active', // o false si no querés refetch
  });
}

export function useContactAutosave() {
  return useSectionAutosave<ContactPatchRequest, ProfileContact>({
    mutationFn: patchContact,
    delay: 400,
    onSuccessUpdate: (prev: ProfileResponse, updated) => ({ ...prev, contact: updated }),
    cacheKeys: [PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useSocialAutosave() {
  return useSectionAutosave<SocialMediaPatchRequest, ProfileSocialMedia>({
    mutationFn: patchSocialMedia,
    delay: 400,
    onSuccessUpdate: (prev: ProfileResponse, updated) => ({ ...prev, socialMedia: updated }),
    cacheKeys: [PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}
