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
  allowedStatusCodes: string[];
};

export type BaseCastingResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  basicInfoSection: CastingSectionBasicInfo;
  rolesSection: CastingSectionRoles;
  requirementsSection: CastingSectionRequirements;
  remunerationSection: CastingSectionRemunerations;
};

export type BaseEmployerCastingEditorResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  basicInfoSectionId: string;
  rolesSectionId: string;
  requirementsSectionId: string;
  remunerationSectionId: string;
  basicInfoSectionStatus: SiteMetadataObject;
  rolesSectionStatus: SiteMetadataObject;
  requirementsSectionStatus: SiteMetadataObject;
  remunerationSectionStatus: SiteMetadataObject;
  publishable: boolean;
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
  roles: EmployerCastingRoleCardResponse[];
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
  remuneration: EmployerCastingRemunerationCardResponse;
};

export type BaseCastingRequirementsSection = {
  id: string;
  sectionStatus: SiteMetadataObject;
  requirements: EmployerCastingRequirementCardResponse[];
};

export type BaseCastingRequirement = {
  id: string;
  sectionId: string;
  roleId: string;
  roleName: string;
  requiresAudio: boolean;
  requiresVideo: boolean;
  description: string;
};

export type BaseCastingRemunerationsSection = {
  id: string;
  sectionStatus: SiteMetadataObject;
  compensationType: SiteMetadataObject;
  notes: string;
  remunerations: EmployerCastingRemunerationCardResponse[];
};

export type BaseCastingRemuneration = {
  id: string;
  castingRoleId: string;
  roleName: string;
  isComplete: boolean;
  payRateType: SiteMetadataObject;
  currency: SiteMetadataObject;
  amount: number;
};

export type CastingCheckoutRole = {
  id: string;
  roleName: string;
  roleType: SiteMetadataObject;
};

export type CastingSectionCheckout = {
  id: string;
  defaultCode: string;
  castingTitle: string;
  projectType: SiteMetadataObject;
  castingModality: SiteMetadataObject;
  applicationDeadline: string;
  roles: CastingCheckoutRole[];
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingSectionBasicInfo = WithAuditable<DeepNullableExceptId<BaseCastingBasicInfo>>;
export type CastingSectionRoles = WithAuditable<BaseCastingRolesSection>;
export type CastingSectionRequirements = WithAuditable<BaseCastingRequirementsSection>;
export type CastingSectionRemunerations = WithAuditable<BaseCastingRemunerationsSection>;

export type EmployerCastingRoleCardResponse = WithAuditable<BaseCastingRole>;
export type EmployerCastingRequirementCardResponse = WithAuditable<BaseCastingRequirement>;
export type EmployerCastingRemunerationCardResponse = WithAuditable<BaseCastingRemuneration>;

export type CastingCardResponse = WithAuditable<BaseCastingCard>;
export type CastingResponse = WithAuditable<BaseCastingResponse>;
export type EmployerCastingEditorResponse = WithAuditable<BaseEmployerCastingEditorResponse>;
