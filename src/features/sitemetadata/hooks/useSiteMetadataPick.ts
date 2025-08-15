// features/sitemetadata/hooks/useSiteMetadataPick.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSiteMetadata, METADATA_CACHE_KEY } from '../services/siteMetadataService';
import type { SiteMetadataResponse } from '../types/sitemetadata.types';

export function useSiteMetadataPick<const Keys extends readonly (keyof SiteMetadataResponse)[]>(keys: Keys) {
  type Picked = Pick<SiteMetadataResponse, Keys[number]>;
  return useQuery<SiteMetadataResponse, unknown, Picked>({
    queryKey: METADATA_CACHE_KEY,
    queryFn: fetchSiteMetadata,
    select: (d) => {
      const out = {} as Picked;
      for (const k of keys) (out as any)[k] = d[k];
      return out;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
