import type {
  EmployerCastingDetailsResponse,
  CastingEmployerInfoResponse,
  CastingRoleResponse,
} from '../../employer/employer-castings/types/employerCastings.types';

export type CastingDetailsResponse = EmployerCastingDetailsResponse;

export type PublicCastingDetailsResponse = {
  casting: CastingDetailsResponse;
  alreadyApplied: boolean;
};

export type PublicCastingOverviewResponse = {
  casting: CastingDetailsResponse;
  appliedRoleIds: string[];
};

export type EmployerInfo = CastingEmployerInfoResponse;
export type CastingRole = CastingRoleResponse;

export type CastingRequirement = {
  id: string;
  roleId: string;
  description: string;
  requiresAudio: boolean;
  requiresVideo: boolean;
};
