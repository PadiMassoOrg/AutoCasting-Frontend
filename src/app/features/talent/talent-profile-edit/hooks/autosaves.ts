import type { LastModifiedResponse } from '../../../../shared/types/auditable.types';
import { createNewCredit, deleteCredit, patchCredit, PROFILE_CREDITS_CACHE_KEY } from '../services/creditsService';
import {
  createNewEducation,
  deleteEducation,
  patchEducation,
  PROFILE_EDUCATION_CACHE_KEY,
} from '../services/educationService';
import {
  patchBasicInfo,
  patchCharacteristics,
  patchContact,
  patchMedia,
  patchSkills,
  patchSocialMedia,
  TALENT_PROFILE_CACHE_KEY,
} from '../services/talentProfileService';
import type {
  BasicInfoPatchRequest,
  CharacteristicsPatchRequest,
  ContactPatchRequest,
  CreditRequest,
  EducationRequest,
  MediaPatchRequest,
  SkillsPatchRequest,
  SocialMediaPatchRequest,
} from '../types/requests';
import type {
  Characteristics,
  Credit,
  Education,
  Media,
  ProfileSocialMedia,
  SkillsResponse,
  TalentProfileBasicInfo,
  TalentProfileContact,
  TalentProfileResponse,
} from '../types/talentProfile.types';
import { useSectionAutosave } from './useSectionAutoSave';

export function useBasicInfoAutosave() {
  return useSectionAutosave<BasicInfoPatchRequest, TalentProfileBasicInfo>({
    mutationFn: patchBasicInfo,
    delay: 800,
    onSuccessUpdate: (prev: TalentProfileResponse, updated) => ({ ...prev, basicInfo: updated }),
    cacheKeys: [TALENT_PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
    fieldMap: {
      professionIds: 'professions',
    },
  });
}

export function useContactAutosave() {
  return useSectionAutosave<ContactPatchRequest, TalentProfileContact>({
    mutationFn: patchContact,
    delay: 400,
    onSuccessUpdate: (prev: TalentProfileResponse, updated) => ({ ...prev, contact: updated }),
    cacheKeys: [TALENT_PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useSocialMediaAutosave() {
  return useSectionAutosave<SocialMediaPatchRequest, ProfileSocialMedia>({
    mutationFn: patchSocialMedia,
    delay: 400,
    onSuccessUpdate: (prev: TalentProfileResponse, updated) => ({ ...prev, socialMedia: updated }),
    cacheKeys: [TALENT_PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useMediaAutosave() {
  return useSectionAutosave<MediaPatchRequest, Media>({
    mutationFn: patchMedia,
    delay: 400,
    onSuccessUpdate: (prev: TalentProfileResponse, updated) => ({ ...prev, media: updated }),
    cacheKeys: [TALENT_PROFILE_CACHE_KEY],
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
    cacheKeys: [TALENT_PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useSkillsAutosave() {
  return useSectionAutosave<SkillsPatchRequest, SkillsResponse>({
    mutationFn: patchSkills,
    delay: 200,
    onSuccessUpdate: (prev, updated) => ({
      ...prev,
      skills: updated.skills,
    }),
    cacheKeys: [TALENT_PROFILE_CACHE_KEY],
    invalidateOnSuccess: 'active',
  });
}

export function useCreditAutosave() {
  return useSectionAutosave<CreditRequest, Credit>({
    mutationFn: createNewCredit,
    delay: 200,
    cacheKeys: [TALENT_PROFILE_CACHE_KEY, PROFILE_CREDITS_CACHE_KEY],
    invalidateOnSuccess: false,
    fieldMap: {
      productionTypeId: 'productionType',
    },
    onSuccessUpdate: (prev, created) => {
      if (Array.isArray(prev)) {
        return [...prev, created];
      }
      return {
        ...prev,
        credits: [...(prev?.credits ?? []), created],
      };
    },
  });
}

export function useCreditPatchAutosave() {
  return useSectionAutosave<CreditRequest, Credit>({
    mutationFn: patchCredit,
    delay: 200,
    cacheKeys: [TALENT_PROFILE_CACHE_KEY, PROFILE_CREDITS_CACHE_KEY],
    invalidateOnSuccess: false,
    fieldMap: {
      productionTypeId: 'productionType',
    },
    onSuccessUpdate: (prev, updated) => {
      const replace = (arr: Credit[]) => arr.map((c) => (c.id === updated.id ? updated : c));
      if (Array.isArray(prev)) return replace(prev);
      return { ...prev, credits: replace(prev?.credits ?? []) };
    },
  });
}

export function useCreditDeleteAutosave() {
  return useSectionAutosave<{ id: string }, { id: string } & LastModifiedResponse>({
    mutationFn: async ({ id }) => {
      const result = await deleteCredit(id);
      return { id, modifiedAt: result.modifiedAt };
    },
    delay: 0,
    cacheKeys: [TALENT_PROFILE_CACHE_KEY, PROFILE_CREDITS_CACHE_KEY],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, { id }) => {
      const remove = (arr: Credit[]) => arr.filter((c) => c.id !== id);
      if (Array.isArray(prev)) return remove(prev);
      return { ...prev, credits: remove(prev?.credits ?? []) };
    },
  });
}

export function useEducationAutosave() {
  return useSectionAutosave<EducationRequest, Education>({
    mutationFn: createNewEducation,
    delay: 200,
    cacheKeys: [TALENT_PROFILE_CACHE_KEY, PROFILE_EDUCATION_CACHE_KEY],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, created) => {
      if (Array.isArray(prev)) {
        return [...prev, created];
      }
      return {
        ...prev,
        education: [...(prev?.education ?? []), created],
      };
    },
  });
}

export function useEducationPatchAutosave() {
  return useSectionAutosave<EducationRequest, Education>({
    mutationFn: patchEducation,
    delay: 200,
    cacheKeys: [TALENT_PROFILE_CACHE_KEY, PROFILE_EDUCATION_CACHE_KEY],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, updated) => {
      const replace = (arr: Education[]) => arr.map((c) => (c.id === updated.id ? updated : c));
      if (Array.isArray(prev)) return replace(prev);
      return { ...prev, education: replace(prev?.education ?? []) };
    },
  });
}

export function useEducationDeleteAutosave() {
  return useSectionAutosave<{ id: string }, { id: string } & LastModifiedResponse>({
    mutationFn: async ({ id }) => {
      const result = await deleteEducation(id);
      return { id, modifiedAt: result.modifiedAt };
    },
    delay: 0,
    cacheKeys: [TALENT_PROFILE_CACHE_KEY, PROFILE_EDUCATION_CACHE_KEY],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, { id }) => {
      const remove = (arr: Education[]) => arr.filter((c) => c.id !== id);
      if (Array.isArray(prev)) return remove(prev);
      return { ...prev, education: remove(prev?.education ?? []) };
    },
  });
}
