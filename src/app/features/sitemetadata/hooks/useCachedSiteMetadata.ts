import { useQueryClient } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { METADATA_CACHE_KEY } from '../services/siteMetadataService';
import type { SiteMetadataObject, SiteMetadataResponse } from '../types/sitemetadata.types';

export function useCachedSiteMetadata(): SiteMetadataResponse | undefined {
  const qc = useQueryClient();
  return qc.getQueryData<SiteMetadataResponse>(METADATA_CACHE_KEY);
}

export function useCachedSiteMetadataSlice<K extends keyof SiteMetadataResponse>(key: K) {
  const all = useCachedSiteMetadata();
  return all?.[key];
}

export function useCachedSiteMetadataOption(
  key: keyof SiteMetadataResponse,
  t: TFunction,
  category?: string | null
): { value: string; label: string }[] {
  const list = useCachedSiteMetadataSlice(key) as SiteMetadataObject[] | undefined;
  if (!list) return [];

  let filtered = list;

  if (category) {
    const categoryCode = `sitemetadata.category.${category}`;
    filtered = list.filter((x) => x.categoryStringCode === categoryCode);
  }

  return filtered.map((x) => ({
    value: x.id,
    label: t(x.stringCode),
  }));
}
