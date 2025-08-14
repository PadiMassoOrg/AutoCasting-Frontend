import { useEffect } from 'react';
import { fetchSiteMetadata, fetchSiteMetadataVersion } from '../features/sitemetadata/services/siteMetadataService';
import { METADATA_KEY } from '../features/sitemetadata/hooks/useSiteMetadata';
import { queryClient } from '../shared/lib/queryClient';

const VERSION_KEY = 'pm-metadata-version';

export default function MetadataBootstrap() {
  useEffect(() => {
    const check = async () => {
      try {
        const siteMetadataVersionResponse = await fetchSiteMetadataVersion();
        const localVersion = localStorage.getItem(VERSION_KEY);

        if (siteMetadataVersionResponse.version !== localVersion) {
          // versión nueva -> invalidar y precargar
          await queryClient.invalidateQueries({ queryKey: METADATA_KEY });
          await queryClient.prefetchQuery({
            queryKey: METADATA_KEY,
            queryFn: () => fetchSiteMetadata(),
          });
          localStorage.setItem(VERSION_KEY, siteMetadataVersionResponse.version);
        } else {
          // misma versión: si no hay cache (p.ej. primer arranque), precarga
          const cached = queryClient.getQueryData(METADATA_KEY);
          if (!cached) {
            await queryClient.prefetchQuery({
              queryKey: METADATA_KEY,
              queryFn: () => fetchSiteMetadata(),
            });
          }
        }
      } catch {
        // ignorar errores de red en bootstrap
      }
    };

    check();

    // Opcional: re-chequear cuando el tab vuelve a primer plano
    const onVis = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return null;
}
