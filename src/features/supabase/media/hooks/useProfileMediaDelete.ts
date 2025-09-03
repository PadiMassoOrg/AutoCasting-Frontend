import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PROFILE_CACHE_KEY, patchMedia } from '../../../profile/services/profileService';
import type { MediaPatchRequest } from '../../../profile/types/requests';
import { removeByPublicUrl } from '../lib/profile-media';

type DeleteArgs =
  | { slot: 'headshot'; url?: string | null }
  | { slot: 'fullbody'; url?: string | null }
  | { slot: 'other'; index: number; url?: string | null };

/**
 * Recibe la URL actual desde el caller (no usa cache para leerla).
 * 1) Si hay URL, borra en Supabase (tolerante a ?query).
 * 2) PATCH con present & null alineado a JsonNullable en backend.
 * 3) Actualiza la cache del perfil con la respuesta del PATCH.
 */
export function useProfileMediaDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: DeleteArgs) => {
      const { slot } = args;

      // 1) borrar en Supabase si hay URL
      const url =
        slot === 'headshot'
          ? ((args as Extract<DeleteArgs, { slot: 'headshot' }>).url ?? undefined)
          : slot === 'fullbody'
            ? ((args as Extract<DeleteArgs, { slot: 'fullbody' }>).url ?? undefined)
            : ((args as Extract<DeleteArgs, { slot: 'other' }>).url ?? undefined);

      if (url) {
        try {
          await removeByPublicUrl(url);
        } catch (err) {
          // Si el objeto ya no existe o hay error menor, seguimos igual con el PATCH
          // (evita bloquear el flujo por un 404 del storage).
          // console.warn('removeByPublicUrl fallo, continuo con PATCH', err);
        }
      }

      // 2) PATCH present & null
      let payload: MediaPatchRequest;
      if (slot === 'headshot') payload = { headshotImageUrl: null };
      else if (slot === 'fullbody') payload = { fullBodyImageUrl: null };
      else {
        const { index } = args as Extract<DeleteArgs, { slot: 'other'; index: number }>;
        payload = { otherPictures: [{ index, url: null }] };
      }

      const updated = await patchMedia(payload);
      return updated;
    },

    onSuccess: (updated) => {
      qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updated } : prev));
    },
  });
}
