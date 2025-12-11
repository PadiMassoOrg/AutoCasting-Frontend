import type { BasePersonSearchFiltersQS } from '../../search/personSearchFilters.types';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type BaseCastingRolePublicCard = {
  id: string;
  name: string;
  employerImageUrl: string;
  employerCompanyName: string;
  projectType: SiteMetadataObject;
  castingModality: SiteMetadataObject;
  location: string;
  shootingStartDate: string;
  shootingEndDate: string;
  professions: SiteMetadataObject[];
  roleType: SiteMetadataObject;
  gender: SiteMetadataObject;
  ageMin: Number;
  ageMax: Number;
  defaultCode: String;
};

export type CastingFiltersQS = BasePersonSearchFiltersQS & {
  roleName?: string;
  projectTypeIds?: string[];
  castingModalityIds?: string[];
  locationText?: string;
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingRolePublicCardResponse = BaseCastingRolePublicCard;
