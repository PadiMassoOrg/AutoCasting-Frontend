import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import { stripUndefined } from '../../../../shared/utils/stripUndefined';
import type { SocialMediaPatchRequest } from '../../../talent/talent-profile-edit/types/requests';
import type { ProfileSocialMedia } from '../../../talent/talent-profile-edit/types/talentProfile.types';
import type { EmployerProfileBasicInfo, EmployerProfileResponse } from '../types/employerProfile.types';
import type { EmployerBasicInfoPatchRequest } from '../types/requests';

export const EMPLOYER_PROFILE_CACHE_KEY = ['employer-cache-profile'] as const;

// GET
export const getMyProfile = async (): Promise<EmployerProfileResponse> => {
  const response = await api.get(API_ROUTES.EMPLOYER_PROFILE);
  return response.data;
};

// PATCH
export async function patchEmployerBasicInfo(
  payload: EmployerBasicInfoPatchRequest
): Promise<EmployerProfileBasicInfo> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.EMPLOYER_BASIC_INFO, body);
  return data;
}

export async function patchSocialMedia(payload: SocialMediaPatchRequest): Promise<ProfileSocialMedia> {
  const { data } = await api.patch(API_ROUTES.EMPLOYER_BASIC_INFO, payload);
  return data;
}
