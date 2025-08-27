import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type BaseProfileResponse = {
  id: string;
  roleStringCode: string;
  planStringCode: string;
  publicSlug: string;
  basicInfo: ProfileBasicInfo;
  contact: ProfileContact;
  socialMedia: ProfileSocialMedia;
  media: Media;
  characteristics: Characteristics;
  skills: Array<SiteMetadataObject>;
  credits: Array<Credit>;
  education: Array<Education>;
};

export type BasePublicProfileResponse = {
  id?: string;
  roleStringCode: string;
  planStringCode: string;
  publicSlug: string;
  basicInfo: ProfileBasicInfo;
  contact: ProfileContact;
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
  gender: string;
  birthDate: string;
  professions: SiteMetadataObject[];
  professionIds: string[];
};

export type BaseProfileContact = {
  id: string;
  email: string;
  phoneNumber: string;
};

export type BaseProfileSocialMedia = {
  id: string;
  instagramUrl: string;
  tikTokUrl: string;
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
  weightKg: number;
  hairColor: SiteMetadataObject;
  hairColorId: string;
  eyeColor: SiteMetadataObject;
  eyeColorId: string;
  chestCm: number;
  waistCm: number;
  hipCm: number;
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

// Util: deep-nullable para todo MENOS la propiedad "id" (que queda requerida y no-nula).
export type DeepNullableExceptId<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer U>
    ? Array<DeepNullableExceptId<U>> | null
    : T extends object
      ? {
          [K in keyof T]: K extends 'id'
            ? NonNullable<T[K]> // id siempre requerido y no-nulo
            : DeepNullableExceptId<T[K]> | null; // el resto puede ser null (y se transforma recursivamente)
        }
      : T | null;

/* ======================
   Export (DeepNullable)
   ====================== */
export type Credit = BaseCredit;
export type Education = BaseEducation;
export type ProfileBasicInfo = DeepNullableExceptId<BaseProfileBasicInfo>;
export type ProfileContact = DeepNullableExceptId<BaseProfileContact>;
export type ProfileSocialMedia = DeepNullableExceptId<BaseProfileSocialMedia>;
export type Media = DeepNullableExceptId<BaseMedia>;
export type Characteristics = DeepNullableExceptId<BaseCharacteristics>;

export type ProfileResponse = BaseProfileResponse;
export type PublicProfileResponse = BasePublicProfileResponse;
