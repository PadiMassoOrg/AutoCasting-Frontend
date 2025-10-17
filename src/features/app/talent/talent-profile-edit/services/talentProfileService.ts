import api from '../../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../../shared/lib/routes';
import { stripUndefined } from '../../../../../shared/utils/stripUndefined';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type {
  BasicInfoPatchRequest,
  CharacteristicsPatchRequest,
  ContactPatchRequest,
  MediaPatchRequest,
  SkillsPatchRequest,
  SocialMediaPatchRequest,
} from '../types/requests';
import type {
  Characteristics,
  Media,
  TalentProfileBasicInfo,
  TalentProfileContact,
  TalentProfileResponse,
  TalentProfileSocialMedia,
} from '../types/talentProfile.types';

export const TALENT_PROFILE_CACHE_KEY = ['cache-profile'] as const;

// GET
export const getMyProfile = async (): Promise<TalentProfileResponse> => {
  const response = await api.get(API_ROUTES.TALENT_PROFILE);
  return response.data;
};

// PATCH
export async function patchBasicInfo(payload: BasicInfoPatchRequest): Promise<TalentProfileBasicInfo> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.TALENT_BASIC_INFO, body);
  return data;
}
export async function patchContact(payload: ContactPatchRequest): Promise<TalentProfileContact> {
  const { data } = await api.patch(API_ROUTES.TALENT_CONTACT, payload);
  return data;
}
export async function patchSocialMedia(payload: SocialMediaPatchRequest): Promise<TalentProfileSocialMedia> {
  const { data } = await api.patch(API_ROUTES.TALENT_SOCIAL_MEDIA, payload);
  return data;
}

export async function patchMedia(payload: MediaPatchRequest): Promise<Media> {
  const { data } = await api.patch(API_ROUTES.TALENT_MEDIA, payload);
  return data;
}

export async function patchCharacteristics(payload: CharacteristicsPatchRequest): Promise<Characteristics> {
  const { data } = await api.patch(API_ROUTES.TALENT_CHARACTERISTICS, payload);
  return data;
}

export async function patchSkills(payload: SkillsPatchRequest): Promise<SiteMetadataObject[]> {
  const { data } = await api.patch(API_ROUTES.TALENT_SKILLS, payload);
  return data;
}
