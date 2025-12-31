import type { CharacteristicsPatchRequest } from '../../../talent/talent-profile-edit/types/requests';
import type { CastingBasicInfo } from './employerCastings.types';

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

export type CastingBasicInfoPatchRequest = Partial<CastingBasicInfo>;

export type CastingRolePatchRequest = CastingRoleUpsertRequest & { id: string };
export type CastingRoleDeleteRequest = { id: string };
