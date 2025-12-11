import type { DeepNullableExceptId } from '../../../../shared/utils/typeUtils';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type { Characteristics } from '../../../talent/talent-profile-edit/types/talentProfile.types';

export type CastingBaseResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  castingBasicInfo: CastingBasicInfo;
  castingRoles: CastingRoles;
  castingActing: CastingActing;
  castingRemuneration: CastingRemuneration;
};

// ======================
// Related Entities
// ======================
export type BaseCastingBasicInfo = {
  id: string;
  sectionStatus: SiteMetadataObject;
  title: string;
  projectType: SiteMetadataObject;
  location: string;
  castingModality: SiteMetadataObject;
  castingModalityText: string;
  applicationDeadline: string;
  hasWardrobeFitting: boolean;
  wardrobeFittingText: string;
  shootingStartDate: string;
  shootingEndDate: string;
  description: string;
};

export type BaseCastingRoles = {
  id: string;
  sectionStatus: SiteMetadataObject;
  generalNotes: string;
  roles: CastingRole[];
};

export type BaseCastingRole = {
  id: string;
  isComplete: boolean;
  name: string;
  roleType: SiteMetadataObject;
  gender: SiteMetadataObject;
  ageMin: number;
  ageMax: number;
  description: string;
  professions: SiteMetadataObject[];
  characteristics: Characteristics;
  skills: SiteMetadataObject[];
};

export type BaseCastingActing = {
  id: string;
  sectionStatus: SiteMetadataObject;
  actingMode: SiteMetadataObject;
  requirements: CastingActingRequirement[];
};

export type BaseCastingActingRequirement = {
  id: string;
  castingRoleId: string;
  isComplete: boolean;
  description: string;
  slotsCount: number;
};

export type BaseCastingRemuneration = {
  id: string;
  sectionStatus: SiteMetadataObject;
  compensationType: SiteMetadataObject;
  paySameForAllRoles: boolean;
  remunerations: CastingRoleRemuneration[];
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

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingBasicInfo = DeepNullableExceptId<BaseCastingBasicInfo>;
export type CastingRoles = DeepNullableExceptId<BaseCastingRoles>;
export type CastingRole = DeepNullableExceptId<BaseCastingRole>;
export type CastingActing = DeepNullableExceptId<BaseCastingActing>;
export type CastingActingRequirement = DeepNullableExceptId<BaseCastingActingRequirement>;
export type CastingRemuneration = DeepNullableExceptId<BaseCastingRemuneration>;
export type CastingRoleRemuneration = DeepNullableExceptId<BaseCastingRoleRemuneration>;

export type CastingResponse = CastingBaseResponse;
