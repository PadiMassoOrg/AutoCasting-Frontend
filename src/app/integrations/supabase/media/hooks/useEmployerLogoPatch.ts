import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EMPLOYER_PROFILE_CACHE_KEY,
  patchEmployerBasicInfo,
} from '../../../../features/employer/employer-profile-edit/services/employerProfileService';
import type { EmployerProfileBasicInfo } from '../../../../features/employer/employer-profile-edit/types/employerProfile.types';
import { SUPABASE } from '../../constants';
import { assertImageSourceSize, optimizeImageForUpload } from '../lib/imageOptimization';
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
      if (!file.type.startsWith('image/')) throw new Error('validation.type_image');
      assertImageSourceSize(file);

      const optimizedFile = await optimizeImageForUpload(file, 'employer-logo');

      const key = buildStorageKey(profileId, optimizedFile);
      const { publicUrl } = await uploadPublic(key, optimizedFile);

      const updated = await patchEmployerBasicInfo({ imageUrl: publicUrl });

      if (previousUrl) {
        try {
          await removeByPublicUrl(previousUrl);
        } catch (e) {
          console.error('Error removing previous employer logo', e);
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
