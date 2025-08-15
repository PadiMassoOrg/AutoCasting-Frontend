export type BasicInfoPatchRequest = {
  stageName?: string;
  gender?: string;
  birthDate?: string; // ISO 'YYYY-MM-DD'
  professionIds?: string[];
};

export type ContactPatchRequest = {
  phoneNumber?: string;
};

export type SocialMediaPatchRequest = {
  instagramUrl?: string;
  tikTokUrl?: string;
};
