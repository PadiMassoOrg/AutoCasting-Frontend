import type { DeepNullableExceptId } from '../../../../shared/utils/typeUtils';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';

export type BaseCastingCard = {
  id: string;
  title: string;
  defaultCode: string;
  creationDate: string;
  applicationDeadline: string;
  projectType: SiteMetadataObject;
  status: SiteMetadataObject;
};

export type BaseCastingResponse = {
  id: string;
  defaultCode: string;
  castingStatus: SiteMetadataObject;
  basicInfoSection: CastingBasicInfo;
};

// ======================
// Related Entities
// ======================
export type BaseCastingBasicInfo = {
  id: string;
  sectionStatus: SiteMetadataObject;
  title: string;
  projectType: SiteMetadataObject;
  projectTypeId: string;
  location: string;
  castingModality: SiteMetadataObject;
  castingModalityId: string;
  castingModalityText: string;
  applicationDeadline: string;
  hasWardrobeFitting: boolean;
  wardrobeFittingText: string;
  shootingStartDay: string;
  shootingEndDay: string;
  description: string;
};

/* ======================
   Export & DeepNullable
   ====================== */
export type CastingBasicInfo = DeepNullableExceptId<BaseCastingBasicInfo>;

export type CastingCardResponse = BaseCastingCard;
export type CastingResponse = BaseCastingResponse;
