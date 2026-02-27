import { useQueryClient } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useMemo, useSyncExternalStore } from 'react';
import { METADATA_CACHE_KEY } from '../services/siteMetadataService';
import type { SiteMetadataObject, SiteMetadataResponse } from '../types/sitemetadata.types';

function isSameKey(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useCachedSiteMetadata(): SiteMetadataResponse | undefined {
  const qc = useQueryClient();

  // Suscripción al cache: fuerza rerender cuando cambie algo en el cache
  const snapshot = useSyncExternalStore(
    (onStoreChange) =>
      qc.getQueryCache().subscribe((event) => {
        const key = event?.query?.queryKey;
        if (key && isSameKey(key, METADATA_CACHE_KEY)) onStoreChange();
      }),
    () => qc.getQueryData<SiteMetadataResponse>(METADATA_CACHE_KEY),
    () => qc.getQueryData<SiteMetadataResponse>(METADATA_CACHE_KEY)
  );

  return snapshot;
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

  return useMemo(() => {
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
  }, [list, category, opts?.raw, t]);
}
