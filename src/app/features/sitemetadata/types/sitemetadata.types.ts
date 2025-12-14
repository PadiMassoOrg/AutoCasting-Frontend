export type SiteMetadataObject = {
  id: string;
  stringCode: string;
  categoryStringCode?: string;
};

export type SiteMetadataResponse = {
  version: string;
  roles: RoleMetadataResponse[];
  plans: PlanMetadataResponse[];
  skills: SiteMetadataObject[];
  professions: SiteMetadataObject[];
  genderOptions: SiteMetadataObject[];
  ethnicityOptions: SiteMetadataObject[];
  colorOptions: SiteMetadataObject[];
  dietOptions: SiteMetadataObject[];
  productionTypeOptions: SiteMetadataObject[];
  socialMediaOptions: SiteMetadataObject[];
  companyTypeOptions: SiteMetadataObject[];
  castingStatusOptions: SiteMetadataObject[];
  castingSectionStatusOptions: SiteMetadataObject[];
  projectTypeOptions: SiteMetadataObject[];
  castingModalityOptions: SiteMetadataObject[];
  roleTypeOptions: SiteMetadataObject[];
  actingModeOptions: SiteMetadataObject[];
  compensationTypeOptions: SiteMetadataObject[];
  payRateTypeOptions: SiteMetadataObject[];
  currencyOptions: SiteMetadataObject[];
};

export type SiteMetadataVersion = {
  version: string;
};

export type RoleMetadataResponse = {
  id: string;
  code: string;
  nameStringCode: string;
  description: string | null;
};

export type PlanMetadataResponse = {
  id: string;
  code: string;
  nameStringCode: string;
  description: string | null;
  allowsCustomSlug: boolean;
};
