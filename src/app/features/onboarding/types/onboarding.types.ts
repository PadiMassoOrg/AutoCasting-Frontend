import type { ActiveMode, OnboardingStatus } from '../../auth/types/auth.types';

export type UserOnboardingRequest = {
  activeMode: ActiveMode;
  talentOnboardingStatus?: OnboardingStatus;
  employerOnboardingStatus?: OnboardingStatus;
};
