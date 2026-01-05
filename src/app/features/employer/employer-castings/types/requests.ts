import type { CharacteristicsPatchRequest } from '../../../talent/talent-profile-edit/types/requests';
import type { CastingSectionBasicInfo } from './employerCastings.types';

export type CastingRoleUpsertRequest = {
  rolesSectionId: string;
  roleName: string;
  roleTypeId: string;
  genderId: string;
  ageMin: number;
  ageMax: number;
  professionIds: string[];
  description?: string | null;
  characteristics?: CharacteristicsPatchRequest | null;
  skillIds?: string[] | null;
};

export type CastingRequirementUpsertRequest = {
  requirementsSectionId: string;
  roleIds: string[];
  requiresAudio: boolean;
  requiresVideo: boolean;
  description?: string;
};

export type CastingBasicInfoPatchRequest = Partial<CastingSectionBasicInfo>;

export type CastingRolePatchRequest = CastingRoleUpsertRequest & { id: string };
export type CastingRoleDeleteRequest = { id: string };

export type CastingRequirementPatchRequest = CastingRequirementUpsertRequest & { id: string };
export type CastingRequirementDeleteRequest = { id: string };
