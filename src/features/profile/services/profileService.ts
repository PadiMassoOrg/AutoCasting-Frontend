import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import { stripUndefined } from '../../../shared/utils/stripUndefined';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import type {
  Characteristics,
  Media,
  ProfileBasicInfo,
  ProfileContact,
  ProfileResponse,
  ProfileSocialMedia,
  PublicProfileResponse,
} from '../types/profile.types';
import type {
  BasicInfoPatchRequest,
  CharacteristicsPatchRequest,
  ContactPatchRequest,
  MediaPatchRequest,
  SkillsPatchRequest,
  SocialMediaPatchRequest,
} from '../types/requests';

export const PROFILE_CACHE_KEY = ['cache-profile'] as const;
export const PUBLIC_PROFILE_CACHE_KEY = ['cache-profile'] as const;
export const PROFILE_BASIC_INFO_CACHE_KEY = ['cache-profile-basic-info'] as const;
export const PROFILE_CONTACT_CACHE_KEY = ['cache-profile-contact'] as const;
export const PROFILE_SOCIAL_MEDIA_CACHE_KEY = ['cache-profile-social-media'] as const;

export const getMyProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get(API_ROUTES.PROFILE);
  return response.data;
};

export const getPublicProfile = async (slug: string): Promise<PublicProfileResponse> => {
  const response = await api.get(API_ROUTES.PROFILE + `/${slug}`);
  return response.data;
};

// PATCH
export async function patchBasicInfo(payload: BasicInfoPatchRequest): Promise<ProfileBasicInfo> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.BASIC_INFO, body);
  return data;
}
export async function patchContact(payload: ContactPatchRequest): Promise<ProfileContact> {
  const { data } = await api.patch(API_ROUTES.CONTACT, payload);
  return data;
}
export async function patchSocialMedia(payload: SocialMediaPatchRequest): Promise<ProfileSocialMedia> {
  const { data } = await api.patch(API_ROUTES.SOCIAL_MEDIA, payload);
  return data;
}

export async function patchMedia(payload: MediaPatchRequest): Promise<Media> {
  const { data } = await api.patch(API_ROUTES.MEDIA, payload);
  return data;
}

export async function patchCharacteristics(payload: CharacteristicsPatchRequest): Promise<Characteristics> {
  const { data } = await api.patch(API_ROUTES.CHARACTERISTICS, payload);
  return data;
}

export async function patchSkills(payload: SkillsPatchRequest): Promise<SiteMetadataObject[]> {
  const { data } = await api.patch(API_ROUTES.SKILLS, payload);
  return data;
}
