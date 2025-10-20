import { useQuery } from '@tanstack/react-query';
import { fetchSiteMetadata, METADATA_CACHE_KEY } from '../services/siteMetadataService';
import type { SiteMetadataResponse } from '../types/sitemetadata.types';

type SliceKey = keyof SiteMetadataResponse;

export function useSiteMetadataSlice<K extends SliceKey>(key: K) {
  return useQuery<SiteMetadataResponse, unknown, SiteMetadataResponse[K]>({
    queryKey: METADATA_CACHE_KEY,
    queryFn: fetchSiteMetadata,
    select: (d) => d[key],
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
