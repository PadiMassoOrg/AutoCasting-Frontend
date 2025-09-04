import { useQuery } from '@tanstack/react-query';
import { fetchSiteMetadata, METADATA_CACHE_KEY } from '../services/siteMetadataService';

export function useSiteMetadata() {
  return useQuery({
    queryKey: METADATA_CACHE_KEY,
    queryFn: fetchSiteMetadata,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 Days
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
