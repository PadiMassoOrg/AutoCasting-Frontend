import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  patchMedia,
  TALENT_PROFILE_CACHE_KEY,
} from '../../../../features/talent/talent-profile-edit/services/talentProfileService';
import type { MediaPatchRequest } from '../../../../features/talent/talent-profile-edit/types/requests';
import { removeByPublicUrl } from '../lib/profile-media';

type DeleteArgs =
  | { slot: 'headshot'; url?: string | null }
  | { slot: 'fullbody'; url?: string | null }
  | { slot: 'other'; index: number; url?: string | null };

export function useProfileMediaDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: DeleteArgs) => {
      const { slot } = args;

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
          // Blank on purpose
          // Si el objeto ya no existe o hay error menor, seguimos igual con el PATCH
          // (evita bloquear el flujo por un 404 del storage).
          // console.warn('removeByPublicUrl fallo, continuo con PATCH', err);
        }
      }

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
      qc.setQueryData(TALENT_PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updated } : prev));
    },
  });
}
