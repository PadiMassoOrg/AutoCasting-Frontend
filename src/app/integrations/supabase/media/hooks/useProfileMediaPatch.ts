import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  patchMedia,
  TALENT_PROFILE_CACHE_KEY,
} from '../../../../features/talent/talent-profile-edit/services/talentProfileService';
import { SUPABASE } from '../../constants';
import { uploadPublic, removeByPublicUrl } from '../lib/profile-media';

type Slot = 'headshot' | 'fullbody' | 'other';

type BaseArgs = {
  file: File;
  previousUrl?: string | null;
};

type MutationArgs = (BaseArgs & { slot: 'headshot' | 'fullbody' }) | (BaseArgs & { slot: 'other'; index: number });

function getExt(name: string, type?: string) {
  const byName = name?.split('.').pop();
  if (byName && byName.length <= 5) return byName.toLowerCase();
  if (type?.includes('/')) return type.split('/')[1];
  return 'bin';
}

function buildStorageKey(profileId: string, slot: Slot, file: File) {
  const ext = getExt(file.name, file.type);
  const ts = Date.now();
  return `${SUPABASE.TALENT_BUCKET}/${profileId}/${SUPABASE.MEDIA}/${slot}/${ts}.${ext}`;
}

export function useProfileMediaPatch(profileId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: MutationArgs) => {
      const { file, slot, previousUrl } = args;
      if (!file.type.startsWith('image/')) throw new Error('Formato no soportado');
      if (file.size > 8 * 1024 * 1024) throw new Error('Máximo 8MB');

      const key = buildStorageKey(profileId, slot, file);
      const { publicUrl } = await uploadPublic(key, file);

      const payload: any = {};
      if (slot === 'headshot') payload.headshotImageUrl = publicUrl;
      if (slot === 'fullbody') payload.fullBodyImageUrl = publicUrl;
      if (slot === 'other') {
        const { index } = args as Extract<MutationArgs, { slot: 'other' }>;
        payload.otherPictures = [{ index, url: publicUrl }];
      }

      const updatedMedia = await patchMedia(payload);

      if (previousUrl) {
        try {
          await removeByPublicUrl(previousUrl);
        } catch (e) {
          console.error('Error removing previous media file', e);
        }
      }

      return updatedMedia;
    },
    onSuccess: (updatedMedia) => {
      qc.setQueriesData({ queryKey: TALENT_PROFILE_CACHE_KEY, exact: false }, (prev: any) =>
        prev ? { ...prev, media: updatedMedia, modifiedAt: updatedMedia.modifiedAt ?? prev.modifiedAt } : prev
      );
      qc.invalidateQueries({ queryKey: TALENT_PROFILE_CACHE_KEY, exact: false, refetchType: 'active' });
    },
  });
}
