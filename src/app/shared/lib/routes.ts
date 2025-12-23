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
  TALENT: '/dashboard/talent',
  TALENT_MEDIA: '/dashboard/talent/media',
  TALENT_DETAILS: '/dashboard/talent/details',
  TALENT_APPLIED_CASTINGS: '/dashboard/talent/applications',
  TALENT_SETTINGS: '/dashboard/talent/settings',
  EMPLOYER: '/dashboard/employer',
  EMPLOYER_CASTINGS: '/dashboard/employer/castings',
  EMPLOYER_NEW_CASTING: '/dashboard/employer/new-casting',
  // Public
  PUBLIC_PROFILE: '/profile',
  TALENT_DATABASE: '/talent-database',
  CASTING_DATABASE: '/casting-database',
  PUBLIC_CASTING: '/casting',
  SUPPORT: '/support',
  FAQ: '/faq',
  TERMS: '/terms-and-conditions',
  PRIVACY: '/privacy-policy',
  // Company:
  LINKEDIN_URL: 'https://www.linkedin.com/feed/',
  INSTAGRAM_URL: 'https://www.instagram.com/',
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
  AUTH_ME_DATA: '/auth/me',
  OAUTH_GOOGLE: '/oauth2/authorization/google',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  // Onboarding
  USER_ONBOARDING: '/auth/onboarding',
  // Legal
  CURRENT_LEGAL_DOCUMENT: '/legal/current',
  ACCEPT_LEGAL_DOCUMENT: '/legal/accept',
  // Database
  TALENT_DATABASE: '/talent-database',
  CASTING_DATABASE: '/castings-database',
  // Talent
  TALENT_PROFILE: '/talent',
  TALENT_BASIC_INFO: '/talent/basic-info',
  TALENT_CONTACT: '/talent/contact',
  TALENT_SOCIAL_MEDIA: '/talent/social-media',
  TALENT_MEDIA: '/talent/media',
  TALENT_CHARACTERISTICS: '/talent/characteristics',
  TALENT_SKILLS: '/talent/skills',
  CREDIT: '/credit',
  EDUCATION: '/education',
  // Employer
  EMPLOYER_PROFILE: '/employer',
  EMPLOYER_BASIC_INFO: '/employer/basic-info',
  EMPLOYER_SOCIAL_MEDIA: '/employer/social-media',
  EMPLOYER_CASTINGS: '/employer/castings',
};
