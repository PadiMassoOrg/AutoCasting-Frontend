import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import { createNewCredit, deleteCredit, patchCredit, PROFILE_CREDITS_CACHE_KEY } from '../services/creditsService';
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
// CREATE
export function useCreditAutosave() {
  return useSectionAutosave<CreditRequest, Credit>({
    mutationFn: createNewCredit,
    delay: 200,
    cacheKeys: [PROFILE_CACHE_KEY, PROFILE_CREDITS_CACHE_KEY], // 👈 ambas
    invalidateOnSuccess: false, // ya hacemos setQueryData
    onSuccessUpdate: (prev, created) => {
      if (Array.isArray(prev)) {
        // prev = Credit[]
        return [...prev, created];
      }
      // prev = ProfileResponse
      return {
        ...prev,
        credits: [...(prev?.credits ?? []), created],
      };
    },
  });
}

// PATCH
export function useCreditPatchAutosave() {
  return useSectionAutosave<CreditRequest, Credit>({
    mutationFn: patchCredit,
    delay: 200,
    cacheKeys: [PROFILE_CACHE_KEY, PROFILE_CREDITS_CACHE_KEY],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, updated) => {
      const replace = (arr: Credit[]) => arr.map((c) => (c.id === updated.id ? updated : c));
      if (Array.isArray(prev)) return replace(prev);
      return { ...prev, credits: replace(prev?.credits ?? []) };
    },
  });
}

// DELETE
export function useCreditDeleteAutosave() {
  return useSectionAutosave<{ id: string }, { id: string }>({
    mutationFn: async ({ id }) => {
      await deleteCredit(id); // puede ser 204 No Content
      return { id }; // <- devolvemos el id borrado sí o sí
    },
    delay: 0,
    cacheKeys: [PROFILE_CACHE_KEY, PROFILE_CREDITS_CACHE_KEY],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, { id }) => {
      const remove = (arr: Credit[]) => arr.filter((c) => c.id !== id);
      if (Array.isArray(prev)) return remove(prev);
      return { ...prev, credits: remove(prev?.credits ?? []) };
    },
  });
}
