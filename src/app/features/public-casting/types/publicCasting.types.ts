import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type PublicCastingEmployerInfo = {
  id: string;
  companyName: string | null;
  companyType: SiteMetadataObject | null;
  imageUrl: string | null;
  socialMedia: {
    links: Array<{
      optionId: string;
      stringCode: string;
      url: string;
    }>;
  } | null;
  totalCastings: number | null;
  memberSince: string | null;
  websiteUrl: string | null;
};

export type PublicCastingRoleRemuneration = {
  isComplete: boolean;
  payRateType: SiteMetadataObject | null;
  currency: SiteMetadataObject | null;
  amount: number | null;
  notes: string | null;
};

export type PublicCastingRole = {
  id: string;
  roleName: string;
  roleType: SiteMetadataObject | null;
  gender: SiteMetadataObject | null;
  ageMin: number | null;
  ageMax: number | null;
  description: string | null;
  professions: SiteMetadataObject[];
  skills: SiteMetadataObject[];
  remuneration: PublicCastingRoleRemuneration | null;
  ethnicity: SiteMetadataObject | null;
  tattoo: boolean | null;
  passport: boolean | null;
  drivingLicense: boolean | null;
  requiresAudio: boolean;
  requiresVideo: boolean;
  requirementDescription: string | null;
};

export type PublicCastingData = {
  employerInfo: PublicCastingEmployerInfo;
  title: string;
  projectType: SiteMetadataObject;
  castingModality: SiteMetadataObject;
  locationText: string | null;
  applicationDeadline: string;
  wardrobeFittingText: string | null;
  shootingStartDate: string;
  shootingEndDate: string;
  description: string | null;
  roles: PublicCastingRole[];
};

export type PublicCastingDetailsResponse = {
  casting: PublicCastingData;
  alreadyApplied: boolean;
};

export type PublicCastingOverviewResponse = {
  casting: PublicCastingData;
  appliedRoleIds: string[];
};

export type EmployerInfo = PublicCastingEmployerInfo;
export type CastingRole = PublicCastingRole;
export type CastingDetailsResponse = PublicCastingData;

export type CastingRequirement = {
  id: string;
  roleId: string;
  description: string;
  requiresAudio: boolean;
  requiresVideo: boolean;
};
