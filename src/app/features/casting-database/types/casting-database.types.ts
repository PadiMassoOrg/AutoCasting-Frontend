import type { BasePersonSearchFiltersQS } from '../../search/personSearchFilters.types';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
export type {
  PublicCastingDetailsResponse as CastingCatalogDetailsResponse,
  PublicCastingRole as CastingCatalogRole,
  CastingRequirement,
} from '../../public-casting/types/publicCasting.types';

export type CastingRolePublicCardResponse = {
  id: string;
  name: string;
  castingTitle: string;
  employerImageUrl: string;
  projectType: SiteMetadataObject;
  shootingStartDate: string;
  shootingEndDate: string;
  roleType: SiteMetadataObject;
  gender: SiteMetadataObject;
  ageMin: number;
  ageMax: number;
  defaultCode: string;
};

export type CastingFiltersQS = BasePersonSearchFiltersQS & {
  roleName?: string;
  projectTypeIds?: string[];
  castingModalityIds?: string[];
  locationText?: string;
};
