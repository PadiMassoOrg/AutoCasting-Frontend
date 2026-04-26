import type { DeepNullableExceptId } from '../../../../shared/utils/typeUtils';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import type { ProfileSocialMedia } from '../../../talent/talent-profile-edit/types/talentProfile.types';

export type BaseEmployerProfileResponse = {
  id: string;
  email: string;
  userAccountProvider: string;
  roleStringCode: string;
  planStringCode: string;
  basicInfo: EmployerProfileBasicInfo;
};

// ======================
// Related Entities
// ======================
export type BaseEmployerProfileBasicInfo = {
  id: string;
  companyName: string;
  taxNumber: string;
  companyType: SiteMetadataObject;
  companyEmail: string;
  imageUrl: string;
  address: string;
  websiteUrl: string;
  about: string;
  socialMedia: ProfileSocialMedia;
};

/* ======================
   Export & DeepNullable
   ====================== */
export type EmployerProfileBasicInfo = DeepNullableExceptId<BaseEmployerProfileBasicInfo>;
export type EmployerProfileResponse = BaseEmployerProfileResponse;
