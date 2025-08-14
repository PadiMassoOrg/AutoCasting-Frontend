import { useQuery } from '@tanstack/react-query';
import type { SiteMetadataResponse } from '../types/sitemetadata.types';
import { fetchSiteMetadata } from '../services/siteMetadataService';

export const METADATA_KEY = ['sitemetadata'] as const;

export function useSiteMetadata() {
  return useQuery<SiteMetadataResponse>({
    queryKey: METADATA_KEY,
    queryFn: fetchSiteMetadata,
  });
}
