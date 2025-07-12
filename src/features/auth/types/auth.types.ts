import type { ForgottenPasswordValues, LoginFormValues, RegisterFormValues } from '../schemas/authSchema';

// Request
export type RegisterRequest = RegisterFormValues;

export type LoginRequest = LoginFormValues;

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
