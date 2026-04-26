import type { ForgottenPasswordValues, LoginFormValues, RegisterFormValues } from '../schemas/authSchema';

// Request
export type RegisterRequest = Pick<RegisterFormValues, 'email' | 'password'>;

export type LoginRequest = Pick<LoginFormValues, 'email' | 'password'>;

export type RoleRequest = {
  role: string;
};

export type ForgotPasswordRequest = ForgottenPasswordValues;

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

// Response
export type AuthenticationResponse = {
  token: string;
};

export type MeDataResponse = {
  id: string;
  email: string;
  activeMode: ActiveMode;
  talentOnboardingStatus: OnboardingStatus;
  employerOnboardingStatus: OnboardingStatus;
};

export type ActiveMode = 'TALENT' | 'EMPLOYER' | null;

export type OnboardingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
