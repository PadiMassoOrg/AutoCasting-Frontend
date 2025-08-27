export const ROUTES = {
  HOME: '/',
  ALL: '/*',
  AUTH: '/auth',
  GOOGLE_OAUTH_SUCCESS: '/oauth2/success',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  PUBLIC_PROFILE: '/profile',
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
  // Params
  PARAM_ROLE: '?role=',
  // Site Metadata
  SITEMETADATA: '/sitemetadata',
  SITEMETADATA_VERSION: '/sitemetadata/version',
  // Authentication
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  OAUTH_GOOGLE: '/oauth2/authorization/google',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  // Profile
  PROFILE: '/profile',
  BASIC_INFO: '/profile/basic-info',
  CONTACT: '/profile/contact',
  SOCIAL_MEDIA: '/profile/social-media',
  MEDIA: '/profile/media',
  CHARACTERISTICS: '/profile/characteristics',
};
