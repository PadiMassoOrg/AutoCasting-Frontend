import { showToast } from 'autocasting-ui-library-padimasso';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import {
  EMPLOYER_PROFILE_CACHE_KEY,
  patchEmployerBasicInfo,
} from '../../../../features/employer/employer-profile-edit/services/employerProfileService';
import type { EmployerProfileBasicInfo } from '../../../../features/employer/employer-profile-edit/types/employerProfile.types';
import { SUPABASE } from '../../constants';
import { assertImageSourceSize, isHeicImage, optimizeImageForUpload } from '../lib/imageOptimization';
import { uploadPublic, removeByPublicUrl } from '../lib/profile-media';

type MutationArgs = { file: File; previousUrl?: string | null };

function getExt(name: string, type?: string) {
  const byName = name?.split('.').pop();
  if (byName && byName.length <= 5) return byName.toLowerCase();
  if (type?.includes('/')) return type.split('/')[1];
  return 'bin';
}

function buildStorageKey(profileId: string, file: File) {
  const ext = getExt(file.name, file.type);
  const ts = Date.now();
  return `${SUPABASE.EMPLOYER_BUCKET}/${profileId}/${SUPABASE.LOGO}/${ts}.${ext}`;
}

export function useEmployerLogoPatch(profileId: string) {
  const qc = useQueryClient();

  return useMutation<EmployerProfileBasicInfo, unknown, MutationArgs>({
    mutationFn: async ({ file, previousUrl }) => {
      if (!file.type.startsWith('image/') && !isHeicImage(file)) throw new Error('validation.type_image');
      assertImageSourceSize(file);

      const optimizedFile = await optimizeImageForUpload(file, 'employer-logo');

      const key = buildStorageKey(profileId, optimizedFile);
      const { publicUrl, key: uploadedKey } = await uploadPublic(key, optimizedFile);

      let updated: EmployerProfileBasicInfo;
      try {
        updated = await patchEmployerBasicInfo({ imageUrl: publicUrl });
      } catch (patchError) {
        // The upload above already landed in Storage; if the PATCH that would reference it
        // fails, the file is orphaned (no DB row points to it). Best-effort clean it up so it
        // doesn't accumulate as unreferenced storage, then rethrow the original error.
        try {
          await removeByPublicUrl(publicUrl);
        } catch (cleanupError) {
          console.error('Error cleaning up orphaned upload after failed PATCH', uploadedKey, cleanupError);
        }
        throw patchError;
      }

      if (previousUrl) {
        try {
          await removeByPublicUrl(previousUrl);
        } catch (e) {
          console.error('Error removing previous employer logo', e);
          showToast({
            title: i18n.t('validation.media_previous_file_cleanup_failed'),
            type: 'warning',
          });
        }
      }

      return updated;
    },
    onSuccess: (updated) => {
      qc.setQueriesData({ queryKey: EMPLOYER_PROFILE_CACHE_KEY, exact: false }, (prev: any) =>
        prev ? { ...prev, basicInfo: updated } : prev
      );
      qc.invalidateQueries({ queryKey: EMPLOYER_PROFILE_CACHE_KEY, exact: false, refetchType: 'active' });
    },
  });
}
