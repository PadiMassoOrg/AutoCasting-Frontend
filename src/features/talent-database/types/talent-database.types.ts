import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type BaseProfileCard = {
  id: string;
  publicSlug: string;
  stageName: string;
  email: string;
  phoneNumber?: string;
  headshotImageUrl?: string;
  professions: SiteMetadataObject[];
};

export type MatchMode = 'ANY' | 'ALL';

export type TalentFiltersQS = Partial<{
  stageName: string;
  ageMin: number;
  ageMax: number;
  genderIds: string[];
  professionId: string[];
  professionsMode: MatchMode;
  heightMinCm: number;
  heightMaxCm: number;
  hairColorId: string;
  eyeColorId: string;
  tattoo: boolean; // undefined = cualquiera
  passport: boolean;
  drivingLicense: boolean;
  skillId: string[];
  skillsMode: MatchMode;
}>;

/* ======================
   Export & DeepNullable
   ====================== */
export type ProfileCardResponse = BaseProfileCard;
