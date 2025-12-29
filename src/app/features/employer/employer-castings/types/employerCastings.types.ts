import type { DeepNullableExceptId } from '../../../../shared/utils/typeUtils';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type { Characteristics } from '../../../talent/talent-profile-edit/types/talentProfile.types';

export type BaseCastingCard = {
  id: string;
  title: string;
  defaultCode: string;
  creationDate: string;
  applicationDeadline: string;
  projectType: SiteMetadataObject;
  status: SiteMetadataObject;
};

export type BaseCastingResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  basicInfoSection: CastingBasicInfo;
  rolesSection: CastingRolesSection;
};

// ======================
// Related Entities
// ======================
export type BaseCastingBasicInfo = {
  id: string;
  sectionStatus: SiteMetadataObject;
  title: string;
  projectType: SiteMetadataObject;
  projectTypeId: string;
  location: string;
  castingModality: SiteMetadataObject;
  castingModalityId: string;
  castingModalityText: string;
  applicationDeadline: string;
  hasWardrobeFitting: boolean;
  wardrobeFittingText: string;
  shootingStartDate: string;
  shootingEndDate: string;
  description: string;
};

export type BaseCastingRolesSection = {
  id: string;
  sectionStatus: SiteMetadataObject;
  generalNotes: string;
  roles: CastingEmployerCardResponse;
};

export type BaseCastingRole = {
  id: string;
  roleName: string;
  roleType: SiteMetadataObject;
  gender: SiteMetadataObject;
  ageMin: number;
  ageMax: number;
  description: string;
  professions: SiteMetadataObject[];
  characteristics: Characteristics;
  skills: SiteMetadataObject[];
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingBasicInfo = DeepNullableExceptId<BaseCastingBasicInfo>;
export type CastingRolesSection = DeepNullableExceptId<BaseCastingRolesSection>;
export type CastingEmployerCardResponse = BaseCastingRole;

export type CastingCardResponse = BaseCastingCard;
export type CastingResponse = BaseCastingResponse;
