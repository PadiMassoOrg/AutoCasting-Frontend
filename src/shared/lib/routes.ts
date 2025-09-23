export const ROUTES = {
  HOME: '/',
  ALL: '/*',
  // Auth
  AUTH: '/authentication',
  AUTH_REGISTER: '/authentication?mode=register',
  GOOGLE_OAUTH_SUCCESS: '/oauth2/success',
  RESET_PASSWORD: '/reset-password',
  // Dashboard
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  ACCOUNT: '/dashboard/account',
  // Public
  PUBLIC_PROFILE: '/profile',
  TALENT_DATABASE: '/talent-database',
  SUPPORT: '/',
  FAQ: '/',
};

export const USER_ROUTES = [
  {
    id: 1,
    path: '/talent-database',
    name: 'routes.talent-database',
  },
  {
    id: 2,
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
  SKILLS: '/profile/skills',
  // Credits
  CREDIT: '/credit',
  // Education
  EDUCATION: '/education',
  // Talent Database
  TALENT_DATABASE: '/profile/talent-database',
};
