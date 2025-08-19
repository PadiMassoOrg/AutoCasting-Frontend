import { useMutation } from '@tanstack/react-query';
import { uploadPublic } from '../lib/profile-media';
import type { MediaPatchRequest } from '../../../profile/types/requests';
import { patchMedia } from '../../../profile/services/profileService';

type Slot = 'headshot' | 'fullbody' | 'other';

export function useProfileMediaPatch(userId: string) {
  return useMutation({
    mutationFn: async ({ file, slot }: { file: File; slot: Slot }) => {
      // VALIDACIONES rápidas
      if (!file.type.startsWith('image/')) {
        throw new Error('Formato no soportado');
      }
      if (file.size > 8 * 1024 * 1024) {
        throw new Error('Máximo 8MB');
      }

      // === Opción A: público
      const { publicUrl } = await uploadPublic(
        slot === 'headshot' ? 'headshot' : slot === 'fullbody' ? 'fullbody' : 'other',
        file,
        userId
      );

      // arma el payload para tu backend
      const payload: MediaPatchRequest = {};
      if (slot === 'headshot') payload.headshotImageUrl = publicUrl;
      if (slot === 'fullbody') payload.fullBodyImageUrl = publicUrl;
      if (slot === 'other') payload.otherPicturesUrl = [publicUrl];

      // PATCH a tu backend
      return patchMedia(payload);
    },
  });
}
