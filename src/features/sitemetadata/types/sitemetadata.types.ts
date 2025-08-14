export type SiteMetadataObject = {
  id: string;
  stringCode: string; // p.ej. "sitemetadata.skill.athletics"
  categoryStringCode: string; // p.ej. "sitemetadata.category.sport"
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
