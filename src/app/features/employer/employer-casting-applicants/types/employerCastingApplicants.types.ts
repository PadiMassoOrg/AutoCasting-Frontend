import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';

export type ApplicantRequirementSubmissionRow = {
  castingRequirementId: string;
  requiresAudio: boolean;
  requiresVideo: boolean;
  audioUrl?: string;
  videoUrl?: string;
  notes?: string;
};

export type EmployerCastingApplicantCardResponse = {
  applicationId: string;
  talentPublicSlug: string;
  talentHeadshotImageUrl: string;
  talentStageName: string;
  talentProfessions: SiteMetadataObject[];
  talentEmail: string;
  talentPhoneNumber: string;
  castingTitle: string;
  castingRoleName: string;
  castingRoleId: string;
  castingSlug: string;
  applicationStatus: SiteMetadataObject;
  requirementSubmissions: ApplicantRequirementSubmissionRow[];
};

export type EmployerCastingApplicantsRoleSliceResponse = {
  roleId: string;
  roleName: string;
  items: EmployerCastingApplicantCardResponse[];
  hasNext: boolean;
  page: number;
  size: number;
};

export type EmployerCastingApplicantsGroupedResponse = {
  castingSlug: string;
  roles: EmployerCastingApplicantsRoleSliceResponse[];
};
