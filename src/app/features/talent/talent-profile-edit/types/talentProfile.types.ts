import type { DeepNullableExceptId } from '../../../../shared/utils/typeUtils';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type { ProfileProgress } from '../services/computeProfileProgress';

export type TalentBaseProfileResponse = {
  id: string;
  userAccountProvider: string;
  roleStringCode: string;
  planStringCode: string;
  publicSlug: string;
  basicInfo: TalentProfileBasicInfo;
  contact: TalentProfileContact;
  socialMedia: ProfileSocialMedia;
  media: Media;
  characteristics: Characteristics;
  skills: Array<SiteMetadataObject>;
  credits: Array<Credit>;
  education: Array<Education>;
};

export type TalentBasePublicProfileResponse = {
  id?: string;
  roleStringCode: string;
  planStringCode: string;
  publicSlug: string;
  basicInfo: TalentProfileBasicInfo;
  contact: TalentProfileContact;
  socialMedia: ProfileSocialMedia;
  media: Media;
  characteristics: Characteristics;
  skills: Array<SiteMetadataObject>;
  credits: Array<Credit>;
  education: Array<Education>;
};

// ======================
// Related Entities
// ======================
export type BaseProfileBasicInfo = {
  id: string;
  stageName: string;
  gender: SiteMetadataObject;
  genderId: string;
  birthDate: string;
  professions: SiteMetadataObject[];
  professionIds: string[];
};

export type BaseProfileContact = {
  id: string;
  email: string;
};

export type SocialMediaLink = {
  optionId: string;
  stringCode: string;
  url: string;
};

export type BaseMedia = {
  id: string;
  headshotImageUrl: string;
  fullBodyImageUrl: string;
  otherPicturesUrl: Array<string>;
  introductionVideoUrl: string;
  showReelVideoUrl: string;
};

export type BaseCharacteristics = {
  id: string;
  heightCm: number;
  ethnicity: SiteMetadataObject;
  ethnicityId: string;
  weightKg: number;
  hairColor: SiteMetadataObject;
  hairColorId: string;
  eyeColor: SiteMetadataObject;
  eyeColorId: string;
  chestCm: number | string;
  waistCm: number | string;
  hipCm: number | string;
  shirtSize: string;
  pantSize: string;
  dressSize: string;
  shoeSize: string;
  tattoo: boolean;
  passport: boolean;
  drivingLicense: boolean;
  dietOption: SiteMetadataObject;
  dietOptionId: string;
};

export type BaseSiteMetadataObject = {
  id: string;
  stringCode: string;
  categoryStringCode?: string;
};

export type BaseCredit = {
  id: string;
  productionType: SiteMetadataObject;
  projectName: string;
  producerName: string;
  role: string;
  year: string;
};

export type BaseEducation = {
  id: string;
  institution: string;
  courseName: string;
  graduationYear: string;
};

/* ======================
   Export & DeepNullable
   ====================== */
export type Credit = BaseCredit;
export type Education = BaseEducation;
export type TalentProfileBasicInfo = DeepNullableExceptId<BaseProfileBasicInfo>;
export type TalentProfileContact = DeepNullableExceptId<BaseProfileContact>;
export type ProfileSocialMedia = { links: SocialMediaLink[] };
export type Media = DeepNullableExceptId<BaseMedia>;
export type Characteristics = DeepNullableExceptId<BaseCharacteristics>;

export type TalentProfileResponse = TalentBaseProfileResponse & { progress: ProfileProgress };
export type TalentPublicProfileResponse = TalentBasePublicProfileResponse;
