import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';

export type CastingCardResponse = {
  id: string;
  title: string;
  defaultCode: string;
  creationDate: string;
  applicationDeadline: string;
  projectType: SiteMetadataObject;
  status: SiteMetadataObject;
  allowedStatusCodes: string[];
};

export type CastingEmployerInfoResponse = {
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
    modifiedAt: string | null;
  } | null;
  totalCastings: number | null;
  memberSince: string | null;
  websiteUrl: string | null;
};

export type CastingRoleRemunerationResponse = {
  isComplete: boolean;
  payRateType: SiteMetadataObject | null;
  currency: SiteMetadataObject | null;
  amount: number | null;
  notes: string | null;
  modifiedAt: string | null;
};

export type CastingRoleResponse = {
  id: string;
  castingId: string;
  roleName: string;
  roleType: SiteMetadataObject | null;
  gender: SiteMetadataObject | null;
  ageMin: number | null;
  ageMax: number | null;
  description: string | null;
  professions: SiteMetadataObject[];
  skills: SiteMetadataObject[];
  remuneration: CastingRoleRemunerationResponse | null;
  ethnicity: SiteMetadataObject | null;
  tattoo: boolean | null;
  passport: boolean | null;
  drivingLicense: boolean | null;
  requiresAudio: boolean;
  requiresVideo: boolean;
  requirementDescription: string | null;
  modifiedAt: string | null;
};

export type CastingResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  employerInfo: CastingEmployerInfoResponse;
  title: string;
  projectType: SiteMetadataObject;
  castingModality: SiteMetadataObject;
  locationText: string | null;
  applicationDeadline: string;
  hasWardrobeFitting: boolean;
  wardrobeFittingText: string | null;
  shootingStartDate: string;
  shootingEndDate: string;
  description: string | null;
  roles: CastingRoleResponse[];
  publishable: boolean;
  modifiedAt: string;
};

export type EmployerCastingEditorResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject | null;
  title: string | null;
  projectType: SiteMetadataObject | null;
  castingModality: SiteMetadataObject | null;
  locationText: string | null;
  applicationDeadline: string | null;
  hasWardrobeFitting: boolean | null;
  wardrobeFittingText: string | null;
  shootingStartDate: string | null;
  shootingEndDate: string | null;
  description: string | null;
  roles: Array<{
    id: string;
    roleName: string;
    modifiedAt: string | null;
  }>;
  publishable: boolean;
  modifiedAt: string | null;
};

export type EmployerCastingCheckoutRoleResponse = {
  id: string;
  roleName: string;
  roleType: SiteMetadataObject | null;
  payRateType: SiteMetadataObject | null;
  currency: SiteMetadataObject | null;
  amount: number | null;
};

export type EmployerCastingCheckoutSummaryResponse = {
  id: string;
  defaultCode: string;
  castingTitle: string | null;
  projectType: SiteMetadataObject | null;
  castingModality: SiteMetadataObject | null;
  applicationDeadline: string | null;
  roles: EmployerCastingCheckoutRoleResponse[];
};

export type CastingBasicInfoFormData = {
  title: string;
  projectTypeId: string | null;
  castingModalityId: string | null;
  locationText: string;
  applicationDeadline: string;
  hasWardrobeFitting: boolean | null;
  wardrobeFittingText: string;
  shootingStartDate: string;
  shootingEndDate: string;
  description: string;
};

export type CastingBasicInfoFieldKey =
  | 'title'
  | 'projectTypeId'
  | 'castingModalityId'
  | 'locationText'
  | 'applicationDeadline'
  | 'wardrobeFittingText'
  | 'description';

export type CastingRoleFormData = {
  id: string | null;
  castingId: string | null;
  roleName: string;
  roleTypeId: string | null;
  genderId: string | null;
  ageMin: string;
  ageMax: string;
  description: string;
  professionIds: string[];
  skillIds: string[];
  payRateTypeId: string | null;
  currencyId: string | null;
  amount: string;
  remunerationNotes: string;
  requiresAudio: boolean;
  requiresVideo: boolean;
  requirementDescription: string;
  ethnicityId: string | null;
  tattoo: boolean | null;
  passport: boolean | null;
  drivingLicense: boolean | null;
};

export type CastingRoleFieldKey =
  | 'roleName'
  | 'roleTypeId'
  | 'genderId'
  | 'ageMin'
  | 'ageMax'
  | 'professionIds'
  | 'payRateTypeId'
  | 'currencyId'
  | 'ethnicityId'
  | 'amount';
