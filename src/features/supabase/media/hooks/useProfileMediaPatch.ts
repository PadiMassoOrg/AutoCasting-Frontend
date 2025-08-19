// features/profile-media/hooks/useProfileMediaPatch.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cleanupOldSlotFiles, uploadPublic } from '../lib/profile-media';
import type { MediaPatchRequest } from '../../../profile/types/requests';
import { patchMedia, PROFILE_CACHE_KEY } from '../../../profile/services/profileService';

type Slot = 'headshot' | 'fullbody' | 'other';

function getExt(name: string, type?: string) {
  const byName = name?.split('.').pop();
  if (byName && byName.length <= 5) return byName.toLowerCase();
  if (type?.includes('/')) return type.split('/')[1];
  return 'bin';
}

function buildStorageKey(profileId: string, slot: Slot, file: File) {
  const ext = getExt(file.name, file.type);
  const ts = Date.now();
  // cada subida crea un objeto nuevo
  return `profiles/${profileId}/media/${slot}/${ts}.${ext}`;
}

export function useProfileMediaPatch(profileId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, slot }: { file: File; slot: Slot }) => {
      // Validaciones mínimas
      if (!file.type.startsWith('image/')) throw new Error('Formato no soportado');
      if (file.size > 8 * 1024 * 1024) throw new Error('Máximo 8MB');

      // Key en Storage
      const key = buildStorageKey(profileId, slot, file);

      // Subida pública (ajusta tu uploadPublic para aceptar key directo + { upsert })
      const { publicUrl } = await uploadPublic(key, file);

      // Armar PATCH para tu backend
      const payload: MediaPatchRequest = {};
      if (slot === 'headshot') payload.headshotImageUrl = publicUrl;
      if (slot === 'fullbody') payload.fullBodyImageUrl = publicUrl;
      if (slot === 'other') {
        // ⚠️ Tu endpoint reemplaza el Set completo. Mergeá con lo que hay en caché:
        const prev = qc.getQueryData(PROFILE_CACHE_KEY) as { media?: { otherPicturesUrl?: string[] } } | undefined;
        const merged = Array.from(new Set([...(prev?.media?.otherPicturesUrl ?? []), publicUrl]));
        payload.otherPicturesUrl = merged;
      }

      // PATCH
      const updatedMedia = await patchMedia(payload);
      if (slot !== 'other') {
        await cleanupOldSlotFiles(profileId, slot, key);
      }
      return updatedMedia;
    },

    onSuccess: (updatedMedia) => {
      // Refrescar perfil en caché
      qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updatedMedia } : prev));
    },
  });
}
