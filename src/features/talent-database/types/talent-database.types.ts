import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';

export type BaseProfileCard = {
  id: string;
  publicSlug: string;
  stageName: string;
  email: string;
  phoneNumber?: string;
  headshotImageUrl?: string;
  professions: SiteMetadataObject[];
};

/* ======================
   Export & DeepNullable
   ====================== */
export type ProfileCardResponse = BaseProfileCard;
