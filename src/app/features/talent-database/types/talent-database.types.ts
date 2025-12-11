import type { BasePersonSearchFiltersQS } from '../../search/personSearchFilters.types';
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

export type TalentFiltersQS = BasePersonSearchFiltersQS & {
  stageName?: string;
  includeNoHeadshot?: boolean;
  genderIds?: string[];
  ethnicityIds?: string[];
};

/* ======================
   Export & DeepNullable
   ====================== */
export type ProfileCardResponse = BaseProfileCard;
