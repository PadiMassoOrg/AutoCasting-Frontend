import type { WithAuditable } from '../../../../shared/types/auditable.types';
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
  roles: EmployerCastingRoleCardResponse;
};

export type BaseCastingRole = {
  id: string;
  sectionId: string;
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
export type CastingBasicInfo = WithAuditable<DeepNullableExceptId<BaseCastingBasicInfo>>;
export type CastingRolesSection = WithAuditable<DeepNullableExceptId<BaseCastingRolesSection>>;
export type EmployerCastingRoleCardResponse = WithAuditable<BaseCastingRole>;

export type CastingCardResponse = WithAuditable<BaseCastingCard>;
export type CastingResponse = WithAuditable<BaseCastingResponse>;
