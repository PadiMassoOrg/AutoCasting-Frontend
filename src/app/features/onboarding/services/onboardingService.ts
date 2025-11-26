import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { UserOnboardingRequest } from '../types/onboarding.types';

export const patchUserOnboarding = async (body: UserOnboardingRequest) => {
  const { data } = await api.patch(API_ROUTES.USER_ONBOARDING, body);
  return data;
};
