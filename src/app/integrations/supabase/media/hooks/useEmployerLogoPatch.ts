import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EMPLOYER_PROFILE_CACHE_KEY,
  patchEmployerBasicInfo,
} from '../../../../features/employer/employer-profile-edit/services/employerProfileService';
import type { EmployerProfileBasicInfo } from '../../../../features/employer/employer-profile-edit/types/employerProfile.types';
import { uploadPublic } from '../lib/profile-media';

type MutationArgs = { file: File };

function getExt(name: string, type?: string) {
  const byName = name?.split('.').pop();
  if (byName && byName.length <= 5) return byName.toLowerCase();
  if (type?.includes('/')) return type.split('/')[1];
  return 'bin';
}

function buildStorageKey(profileId: string, file: File) {
  const ext = getExt(file.name, file.type);
  const ts = Date.now();
  return `employers/${profileId}/logo/${ts}.${ext}`;
}

export function useEmployerLogoPatch(profileId: string) {
  const qc = useQueryClient();

  return useMutation<EmployerProfileBasicInfo, unknown, MutationArgs>({
    mutationFn: async ({ file }) => {
      if (!file.type.startsWith('image/')) throw new Error('Formato no soportado');
      if (file.size > 8 * 1024 * 1024) throw new Error('Máximo 8MB');

      const key = buildStorageKey(profileId, file);
      const { publicUrl } = await uploadPublic(key, file);

      const updated = await patchEmployerBasicInfo({ imageUrl: publicUrl });

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
