export const ROUTES = {
  HOME: '/',
  ALL: '/*',
  AUTH: '/auth',
  GOOGLE_OAUTH_SUCCESS: '/oauth2/success',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
};

export const USER_ROUTES = [
  {
    id: 1,
    path: '/dashboard/profile',
    name: 'routes.profile',
  },
];

export const API_ROUTES = {
  API_V: '/api/v1',
  SITEMETADATA: '/sitemetadata',
  SITEMETADATA_VERSION: '/sitemetadata/version',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  OAUTH_GOOGLE: '/oauth2/authorization/google',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  PROFILE: '/profile',
  PARAM_ROLE: '?role=',
};
