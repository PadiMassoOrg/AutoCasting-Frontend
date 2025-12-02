import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { MeDataResponse } from '../../auth/types/auth.types';
import type { UserOnboardingRequest } from '../types/onboarding.types';

export const patchUserOnboarding = async (body: UserOnboardingRequest): Promise<MeDataResponse> => {
  const { data } = await api.patch(API_ROUTES.USER_ONBOARDING, body);
  return data;
};
