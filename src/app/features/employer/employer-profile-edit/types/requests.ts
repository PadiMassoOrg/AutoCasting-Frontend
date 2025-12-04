import type { SocialMediaPatchRequest } from '../../../talent/talent-profile-edit/types/requests';

export type EmployerBasicInfoPatchRequest = {
  companyName?: string;
  taxNumber?: string;
  companyTypeId?: string | null;
  companyEmail?: string | null;
  imageUrl?: string | null;
  address?: string | null;
  websiteUrl?: string | null;
  about?: string | null;
};

export type EmployerSocialMediaPatchRequest = SocialMediaPatchRequest;
