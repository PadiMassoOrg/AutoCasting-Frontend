import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';

export type TalentCastingApplicationCardResponse = {
  roleName: string;
  castingName: string;
  castingProjectType: SiteMetadataObject;
  castingModality: SiteMetadataObject;
  castingStatus: SiteMetadataObject;
  castingRoleId: string;
  castingSlug: string;
  companyName: string;
  employerImageUrl: string;
  castingModalityText: string | null;
  shootingStartDate: string;
  shootingEndDate: string;
  gender: SiteMetadataObject;
  professions: SiteMetadataObject[];
  roleType: SiteMetadataObject;
};
