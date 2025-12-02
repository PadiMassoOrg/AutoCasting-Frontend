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
  includeNoHeadshot?: boolean;
  stageName: string;
  ageMin: number;
  ageMax: number;
  genderIds: string[];
  ethnicityIds: string[];
  professionId: string[];
  professionsMode: MatchMode;
  heightMinCm: number;
  heightMaxCm: number;
  hairColorIds: string[];
  hairColorIdsMode: MatchMode;
  eyeColorIds: string[];
  eyeColorIdsMode: MatchMode;
  tattoo: boolean;
  passport: boolean;
  drivingLicense: boolean;
  skillId: string[];
  skillsMode: MatchMode;
}>;

/* ======================
   Export & DeepNullable
   ====================== */
export type ProfileCardResponse = BaseProfileCard;
