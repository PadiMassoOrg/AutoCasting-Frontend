import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { SiteMetadataResponse, SiteMetadataVersion } from '../types/sitemetadata.types';

export const METADATA_CACHE_KEY = ['cache-sitemetadata'] as const;

export const fetchSiteMetadata = async (): Promise<SiteMetadataResponse> => {
  const response = await api.get(API_ROUTES.SITEMETADATA);
  return response.data;
};

export const fetchSiteMetadataVersion = async (): Promise<SiteMetadataVersion> => {
  const response = await api.get(API_ROUTES.SITEMETADATA_VERSION);
  return response.data;
};
