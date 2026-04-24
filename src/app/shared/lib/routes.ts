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
  EMPLOYER_CASTING: '/dashboard/employer/casting',
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

export const getDashboardRouteForActiveMode = (activeMode: 'TALENT' | 'EMPLOYER' | null) => {
  return activeMode === 'EMPLOYER' ? ROUTES.EMPLOYER_CASTINGS : ROUTES.TALENT_APPLIED_CASTINGS;
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
  CASTINGS_DATABASE: '/castings-database',
  // Casting
  CASTING: '/casting',
  // Application
  TALENT_CASTING_APPLY: '/apply',
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
  TALENT_CASTING_APPLICATIONS: '/talent/applications',
  // Employer
  CASTING_BASIC_INFO: '/casting/basic-info',
  CASTING_ROLE: '/casting/role',
  CASTING_REQUIREMENT: '/casting/requirement',
  CASTING_REMUNERATION: '/casting/remuneration',
  CASTING_REMUNERATION_REMUENRATIONS: '/casting/remuneration/remunerations',
  EMPLOYER_PROFILE: '/employer',
  EMPLOYER_BASIC_INFO: '/employer/basic-info',
  EMPLOYER_SOCIAL_MEDIA: '/employer/social-media',
  EMPLOYER_CASTINGS: '/employer/castings',
  EMPLOYER_CASTING: '/employer/casting',
  // Casting Status
  PUBLISH_CASTING: (castingId: string) => `${API_ROUTES.EMPLOYER_CASTING}/${castingId}/publish`,
  DRAFT_CASTING: (castingId: string) => `${API_ROUTES.EMPLOYER_CASTING}/${castingId}/draft`,
  PAUSE_CASTING: (castingId: string) => `${API_ROUTES.EMPLOYER_CASTING}/${castingId}/pause`,
  CLOSE_CASTING: (castingId: string) => `${API_ROUTES.EMPLOYER_CASTING}/${castingId}/close`,
  ARCHIVE_CASTING: (castingId: string) => `${API_ROUTES.EMPLOYER_CASTING}/${castingId}/archive`,
  EMPLOYER_CASTING_APPLICANTS: (castingSlug: string) => `${API_ROUTES.EMPLOYER_CASTING}/${castingSlug}/applicants`,
  EMPLOYER_CASTING_APPLICANTS_GROUPED: (castingSlug: string) =>
    `${API_ROUTES.EMPLOYER_CASTING}/${castingSlug}/applicants/grouped`,
  // Application Status
  EMPLOYER_CASTING_APPLICATIONS: '/employer/applications',
  PRESELECT_APPLICATION: (applicationId: string) =>
    `${API_ROUTES.EMPLOYER_CASTING_APPLICATIONS}/${applicationId}/preselect`,
  SELECT_APPLICATION: (applicationId: string) => `${API_ROUTES.EMPLOYER_CASTING_APPLICATIONS}/${applicationId}/select`,
  NOT_PROCEEDING_APPLICATION: (applicationId: string) =>
    `${API_ROUTES.EMPLOYER_CASTING_APPLICATIONS}/${applicationId}/not-proceeding`,
  VIEW_APPLICATION: (applicationId: string) => `${API_ROUTES.EMPLOYER_CASTING_APPLICATIONS}/${applicationId}/view`,
  BLANK_APPLICATION: (applicationId: string) => `${API_ROUTES.EMPLOYER_CASTING_APPLICATIONS}/${applicationId}/blank`,
};
