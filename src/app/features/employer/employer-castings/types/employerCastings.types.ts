import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';

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

export type CastingCheckoutRole = {
  id: string;
  roleName: string;
  roleType: SiteMetadataObject;
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

export type CastingRoleCardResponse = {
  id: string;
  castingId: string;
  roleName: string;
  gender: SiteMetadataObject | null;
  ageMin: number | null;
  ageMax: number | null;
  professions: SiteMetadataObject[];
  roleType: SiteMetadataObject | null;
  skills: SiteMetadataObject[];
  remuneration: CastingRoleRemunerationResponse | null;
  modifiedAt: string | null;
};

export type EmployerCastingDetailsResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject | null;
  employerInfo: CastingEmployerInfoResponse | null;
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
  roles: CastingRoleResponse[];
  publishable: boolean;
  modifiedAt: string | null;
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
  roles: CastingRoleCardResponse[];
  publishable: boolean;
  modifiedAt: string | null;
};

export type EmployerCastingStatusResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject | null;
  hasBasicInfo: boolean;
  hasRoles: boolean;
  publishable: boolean;
  modifiedAt: string | null;
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

export type CastingSectionCheckout = {
  id: string;
  defaultCode: string;
  castingTitle: string;
  projectType: SiteMetadataObject;
  castingModality: SiteMetadataObject;
  applicationDeadline: string;
  roles: CastingCheckoutRole[];
};

export type CastingCardResponse = BaseCastingCard;
