import type {
  BaseCharacteristics,
  BaseCredit,
  BaseEducation,
  BaseProfileBasicInfo,
  BaseProfileContact,
  BaseProfileSocialMedia,
} from './talentProfile.types';

export type BasicInfoPatchRequest = Partial<BaseProfileBasicInfo>;
export type ContactPatchRequest = Partial<BaseProfileContact>;
export type SocialMediaPatchRequest = Partial<BaseProfileSocialMedia>;
export type CharacteristicsPatchRequest = Partial<BaseCharacteristics>;
export type SkillsPatchRequest = { skillIds: string[] };
export type CreditRequest = Partial<BaseCredit>;
export type EducationRequest = Partial<BaseEducation>;

export type OtherPicturePatch = {
  index: number;
  url: string | null;
};

export type MediaPatchRequest = {
  headshotImageUrl?: string | null;
  fullBodyImageUrl?: string | null;
  otherPictures?: OtherPicturePatch[];
  introductionVideoUrl?: string | null;
  showReelVideoUrl?: string | null;
};
