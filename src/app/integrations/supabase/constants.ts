export const SUPABASE_PROD = {
  MAIN_BUCKET: 'profile-media-public',
  MEDIA: 'media',
  LOGO: 'logo',
  TALENT_BUCKET: 'talent',
  EMPLOYER_BUCKET: 'employer',
};

export const SUPABASE_DEV = {
  MAIN_BUCKET: 'profile-media-develop',
  MEDIA: 'media',
  LOGO: 'logo',
  TALENT_BUCKET: 'talent',
  EMPLOYER_BUCKET: 'employer',
};

export const SUPABASE = import.meta.env.PROD ? SUPABASE_PROD : SUPABASE_DEV;
