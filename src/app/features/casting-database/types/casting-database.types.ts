import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type BaseCastingCard = {
  id: string;
  title: string;
  creationDate: string;
  applicationDeadline: string;
  projectType: SiteMetadataObject;
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingCardResponse = BaseCastingCard;
