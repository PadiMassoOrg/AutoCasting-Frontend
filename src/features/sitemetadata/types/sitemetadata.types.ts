export type SiteMetadataObject = {
  id: string;
  stringCode: string;
  categoryStringCode?: string;
};

export type SiteMetadataResponse = {
  version: string;
  skills: SiteMetadataObject[];
  professions: SiteMetadataObject[];
  colorOptions: SiteMetadataObject[];
  dietOptions: SiteMetadataObject[];
};

export type SiteMetadataVersion = {
  version: string;
};
