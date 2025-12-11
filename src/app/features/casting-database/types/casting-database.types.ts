import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type BaseCastingRolePublicCard = {
  id: string;
  name: string;
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

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingRolePublicCardResponse = BaseCastingRolePublicCard;
