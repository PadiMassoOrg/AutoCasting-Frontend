import type {
  BaseCharacteristics,
  BaseCredit,
  BaseEducation,
  BaseMedia,
  BaseProfileBasicInfo,
  BaseProfileContact,
  BaseProfileSocialMedia,
} from './profile.types';

export type BasicInfoPatchRequest = Partial<BaseProfileBasicInfo>;
export type ContactPatchRequest = Partial<BaseProfileContact>;
export type SocialMediaPatchRequest = Partial<BaseProfileSocialMedia>;
export type MediaPatchRequest = Partial<BaseMedia>;
export type CharacteristicsPatchRequest = Partial<BaseCharacteristics>;
export type SkillsPatchRequest = {
  skillIds: string[];
};
export type CreditRequest = Partial<BaseCredit>;
export type EducationRequest = Partial<BaseEducation>;
