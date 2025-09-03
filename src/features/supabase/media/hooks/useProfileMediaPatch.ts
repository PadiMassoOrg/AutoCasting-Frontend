import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMedia, PROFILE_CACHE_KEY } from '../../../profile/services/profileService';
import { cleanupOldSlotFiles, uploadPublic } from '../lib/profile-media';

type Slot = 'headshot' | 'fullbody' | 'other';
type MutationArgs = { file: File; slot: 'headshot' | 'fullbody' } | { file: File; slot: 'other'; index: number };

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
    mutationFn: async (args: MutationArgs) => {
      const { file, slot } = args;
      if (!file.type.startsWith('image/')) throw new Error('Formato no soportado');
      if (file.size > 8 * 1024 * 1024) throw new Error('Máximo 8MB');

      const key = buildStorageKey(profileId, slot, file);
      const { publicUrl } = await uploadPublic(key, file);

      // Request payload **granular**
      const payload: any = {};
      if (slot === 'headshot') payload.headshotImageUrl = publicUrl;
      if (slot === 'fullbody') payload.fullBodyImageUrl = publicUrl;
      if (slot === 'other') {
        const { index } = args as Extract<MutationArgs, { slot: 'other' }>;
        payload.otherPictures = [{ index, url: publicUrl }];
      }

      const updatedMedia = await patchMedia(payload);
      if (slot !== 'other') {
        await cleanupOldSlotFiles(profileId, slot, key);
      }
      return updatedMedia;
    },
    onSuccess: (updatedMedia) => {
      qc.setQueryData(PROFILE_CACHE_KEY, (prev: any) => (prev ? { ...prev, media: updatedMedia } : prev));
    },
  });
}
