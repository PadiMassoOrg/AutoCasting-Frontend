// Response
export type ProfileResponse = {
  id: string;
  roleStringCode: string;
  planStringCode: string;
  publicSlug: string;
  basicInfo: ProfileBasicInfo;
  contact: ProfileContact;
  socialMedia: ProfileSocialMedia;
  characteristics: Characteristics;
  skills: Array<SiteMetadataObject>;
  credits: Array<Credit>;
  education: Array<Education>;
};

export type PublicProfileResponse = {
  roleStringCode: string;
  planStringCode: string;
  publicSlug: string;
  basicInfo: ProfileBasicInfo;
  contact: ProfileContact;
  socialMedia: ProfileSocialMedia;
};

// ======================
// Related Entities
// ======================
export type ProfileBasicInfo = {
  id: string;
  stageName: string;
  gender: string;
  birthDate: Date;
  professions: Array<SiteMetadataObject>;
};

export type ProfileContact = {
  id: string;
  email: string;
  phoneNumber: string;
};

export type ProfileSocialMedia = {
  id: string;
  instagramUrl: string;
  tikTokUrl: string;
};

export type Media = {
  id: string;
  headshotImageUrl: string;
  fullBodyImageUrl: string;
  otherPicturesUrl: Array<String>;
  introductionVideoUrl: string;
  showReelVideoUrl: string;
};

export type Characteristics = {
  id: string;
  heightCm: number;
  weightKg: number;
  hairColor: SiteMetadataObject;
  eyeColor: SiteMetadataObject;
  chestCm: number;
  waistCm: number;
  hipCm: number;
  shirtSize: string;
  pantSizee: string;
  dressSizee: string;
  shoeSize: string;
  tattoo: boolean;
  passport: boolean;
  drivingLicense: boolean;
  dietOption: SiteMetadataObject;
  skills: Array<SiteMetadataObject>;
  credits: Array<Credit>;
  education: Array<Education>;
};

export type SiteMetadataObject = {
  id: string;
  stringCode: string;
  category: string;
};

export type Credit = {
  id: string;
  productionType: SiteMetadataObject;
  projectName: string;
  producerName: string;
  role: string;
  year: string;
};

export type Education = {
  id: string;
  institution: string;
  courseName: string;
  graduationYear: string;
};
