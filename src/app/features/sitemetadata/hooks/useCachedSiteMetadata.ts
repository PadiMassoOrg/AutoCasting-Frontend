import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { METADATA_CACHE_KEY } from '../services/siteMetadataService';
import type { SiteMetadataObject, SiteMetadataResponse } from '../types/sitemetadata.types';

export function useCachedSiteMetadata(): SiteMetadataResponse | undefined {
  const qc = useQueryClient();

  const { data } = useQuery<SiteMetadataResponse | undefined>({
    queryKey: METADATA_CACHE_KEY,
    enabled: false,
    initialData: () => qc.getQueryData<SiteMetadataResponse>(METADATA_CACHE_KEY),
  });

  return data;
}

export function useCachedSiteMetadataSlice<K extends keyof SiteMetadataResponse>(key: K) {
  const all = useCachedSiteMetadata();
  return all?.[key];
}

/** Default: devuelve options para Select ({value,label}) */
export function useCachedSiteMetadataOption(
  key: keyof SiteMetadataResponse,
  t: TFunction,
  category?: string | null,
  opts?: { raw?: false }
): { value: string; label: string }[];

/** Raw: devuelve los objetos reales (SiteMetadataObject[]) */
export function useCachedSiteMetadataOption(
  key: keyof SiteMetadataResponse,
  t: TFunction,
  category: string | null | undefined,
  opts: { raw: true }
): SiteMetadataObject[];

/** Impl */
export function useCachedSiteMetadataOption(
  key: keyof SiteMetadataResponse,
  t: TFunction,
  category?: string | null,
  opts?: { raw?: boolean }
): { value: string; label: string }[] | SiteMetadataObject[] {
  const list = useCachedSiteMetadataSlice(key) as SiteMetadataObject[] | undefined;
  if (!list) return opts?.raw ? [] : [];

  let filtered = list;

  if (category) {
    const categoryCode = `sitemetadata.category.${category}`;
    filtered = list.filter((x) => x.categoryStringCode === categoryCode);
  }

  if (opts?.raw) return filtered;

  return filtered.map((x) => ({
    value: x.id,
    label: t(x.stringCode),
  }));
}
