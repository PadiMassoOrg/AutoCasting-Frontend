import type { DeepNullableExceptId } from '../../../shared/utils/typeUtils';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import type { Characteristics, ProfileSocialMedia } from '../../talent/talent-profile-edit/types/talentProfile.types';

export type CastingBaseResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  employerInfo: CastingEmployerPublicInfo;
  castingBasicInfo: CastingBasicInfo;
  castingRoles: CastingRoles;
  castingActing: CastingActing;
  castingRemuneration: CastingRemuneration;
};

// ======================
// Related Entities
// ======================
export type BaseCastingEmployerPublicInfo = {
  id: string;
  companyName: string;
  companyType: SiteMetadataObject;
  imageUrl: string;
  totalCastings: number;
  memberSince: string;
  socialMedia: ProfileSocialMedia;
};

export type BaseCastingBasicInfo = {
  id: string;
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
  generalNotes: string;
  roles: CastingRole[];
};

export type BaseCastingRole = {
  id: string;
  name: string;
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

export type BaseCastingActing = {
  id: string;
  actingMode: SiteMetadataObject;
  requirements: CastingActingRequirement[];
};

export type BaseCastingActingRequirement = {
  id: string;
  castingRoleId: string;
  description: string;
  slotsCount: number;
};

export type BaseCastingRemuneration = {
  id: string;
  compensationType: SiteMetadataObject;
  paySameForAllRoles: boolean;
  remunerations: CastingRoleRemuneration[];
};

export type BaseCastingRoleRemuneration = {
  id: string;
  castingRoleId: string;
  payRateType: SiteMetadataObject;
  currency: SiteMetadataObject;
  amount: number;
  notes: string;
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingEmployerPublicInfo = DeepNullableExceptId<BaseCastingEmployerPublicInfo>;
export type CastingBasicInfo = DeepNullableExceptId<BaseCastingBasicInfo>;
export type CastingRoles = DeepNullableExceptId<BaseCastingRoles>;
export type CastingRole = DeepNullableExceptId<BaseCastingRole>;
export type CastingActing = DeepNullableExceptId<BaseCastingActing>;
export type CastingActingRequirement = DeepNullableExceptId<BaseCastingActingRequirement>;
export type CastingRemuneration = DeepNullableExceptId<BaseCastingRemuneration>;
export type CastingRoleRemuneration = DeepNullableExceptId<BaseCastingRoleRemuneration>;

export type PublicCastingResponse = CastingBaseResponse;
