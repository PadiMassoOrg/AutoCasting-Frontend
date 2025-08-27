import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import { createNewCredit } from '../services/creditsService';
import {
  patchBasicInfo,
  patchCharacteristics,
  patchContact,
  patchMedia,
  patchSkills,
  patchSocialMedia,
  PROFILE_CACHE_KEY,
} from '../services/profileService';
import type {
  Characteristics,
  Credit,
  Media,
  ProfileBasicInfo,
  ProfileContact,
  ProfileResponse,
  ProfileSocialMedia,
} from '../types/profile.types';
import type {
  BasicInfoPatchRequest,
  CharacteristicsPatchRequest,
  ContactPatchRequest,
  CreditRequest,
  MediaPatchRequest,
  SkillsPatchRequest,
  SocialMediaPatchRequest,
} from '../types/requests';
import { useSectionAutosave } from './useSectionAutoSave';

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

export function useSocialMediaAutosave() {
  return useSectionAutosave<SocialMediaPatchRequest, ProfileSocialMedia>({
    mutationFn: patchSocialMedia,
    delay: 400,
    onSuccessUpdate: (prev: ProfileResponse, updated) => ({ ...prev, socialMedia: updated }),
    cacheKeys: [PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useMediaAutosave() {
  return useSectionAutosave<MediaPatchRequest, Media>({
    mutationFn: patchMedia,
    delay: 400,
    onSuccessUpdate: (prev: ProfileResponse, updated) => ({ ...prev, media: updated }),
    cacheKeys: [PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useCharacteristicsAutosave() {
  return useSectionAutosave<CharacteristicsPatchRequest, Characteristics>({
    mutationFn: patchCharacteristics,
    delay: 400,
    onSuccessUpdate: (prev, updated) => ({
      ...prev,
      characteristics: updated,
    }),
    cacheKeys: [PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useSkillsAutosave() {
  return useSectionAutosave<SkillsPatchRequest, SiteMetadataObject[]>({
    mutationFn: patchSkills,
    delay: 200,
    onSuccessUpdate: (prev, updated) => ({
      ...prev,
      skills: updated,
    }),
    cacheKeys: [PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useCreditsAutosave() {
  return useSectionAutosave<CreditRequest, Credit>({
    mutationFn: createNewCredit,
    delay: 200,
    onSuccessUpdate: (prev, updated) => ({
      ...prev,
      credits: updated,
    }),
    cacheKeys: [PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}
