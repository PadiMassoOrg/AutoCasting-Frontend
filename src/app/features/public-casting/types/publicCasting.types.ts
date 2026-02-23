import type { DeepNullableExceptId } from '../../../shared/utils/typeUtils';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import type { Characteristics } from '../../talent/talent-profile-edit/types/talentProfile.types';

export type PublicCastingResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  employerInfo: EmployerInfo;
  basicInfoSection: CastingBasicInfoSection;
  rolesSection: CastingRolesSection;
  requirementsSection: CastingRequirementsSection;
  remunerationSection: CastingRemunerationsSection;
};

// ======================
// Employer (Casting public response)
// ======================
export type BaseEmployerInfo = {
  id: string;
  companyName: string;
  companyType: SiteMetadataObject;
  imageUrl: string;
  socialMedia: EmployerSocialMedia;
  totalCastings: number;
  memberSince: string;
  taxNumber?: string;
  companyEmail?: string;
  address?: string;
  websiteUrl?: string;
  about?: string;
};

export type BaseEmployerSocialMedia = {
  links: EmployerSocialMediaLink[];
};

export type BaseEmployerSocialMediaLink = {
  optionId: string;
  stringCode: string;
  url: string;
};

export type EmployerInfo = DeepNullableExceptId<BaseEmployerInfo>;
export type EmployerSocialMedia = DeepNullableExceptId<BaseEmployerSocialMedia>;
export type EmployerSocialMediaLink = DeepNullableExceptId<BaseEmployerSocialMediaLink>;

// ======================
// Sections
// ======================
export type BaseCastingBasicInfoSection = {
  id: string;
  sectionStatus: SiteMetadataObject;
  title: string;
  projectType: SiteMetadataObject;
  castingModality: SiteMetadataObject;
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
  roles: CastingRole[];
};

export type BaseCastingRequirementsSection = {
  id: string;
  sectionStatus: SiteMetadataObject;
  requirements: CastingRequirement[];
};

export type BaseCastingRemunerationsSection = {
  id: string;
  sectionStatus: SiteMetadataObject;
  compensationType: SiteMetadataObject;
  notes: string;
  remunerations: CastingRoleRemunerationRow[];
};

// ======================
// Nested Entities
// ======================
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
  remuneration: CastingRoleRemuneration;
};

export type BaseCastingRequirement = {
  id: string;
  roleId: string;
  description: string;
  requiresAudio: boolean;
  requiresVideo: boolean;
};

export type BaseCastingRoleRemuneration = {
  id: string;
  castingRoleId: string;
  isComplete: boolean;
  payRateType: SiteMetadataObject;
  currency: SiteMetadataObject;
  amount: number;
  notes: string;
};

export type BaseCastingRoleRemunerationRow = BaseCastingRoleRemuneration & {
  roleName: string;
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingBasicInfoSection = DeepNullableExceptId<BaseCastingBasicInfoSection>;
export type CastingRolesSection = DeepNullableExceptId<BaseCastingRolesSection>;
export type CastingRequirementsSection = DeepNullableExceptId<BaseCastingRequirementsSection>;
export type CastingRemunerationsSection = DeepNullableExceptId<BaseCastingRemunerationsSection>;

export type CastingRole = DeepNullableExceptId<BaseCastingRole>;
export type CastingRequirement = DeepNullableExceptId<BaseCastingRequirement>;

export type CastingRoleRemuneration = DeepNullableExceptId<BaseCastingRoleRemuneration>;
export type CastingRoleRemunerationRow = DeepNullableExceptId<BaseCastingRoleRemunerationRow>;
