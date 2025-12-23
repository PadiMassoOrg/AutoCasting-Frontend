import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';

export type BaseCastingCard = {
  id: string;
  title: string;
  defaultCode: string;
  creationDate: string;
  applicationDeadline: string;
  projectType: SiteMetadataObject[];
  status: SiteMetadataObject[];
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingCardResponse = BaseCastingCard;
