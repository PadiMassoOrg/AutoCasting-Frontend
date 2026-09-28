import { showToast } from 'autocasting-ui-library-padimasso';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import {
  EMPLOYER_PROFILE_CACHE_KEY,
  patchEmployerBasicInfo,
} from '../../../../features/employer/employer-profile-edit/services/employerProfileService';
import type { EmployerProfileBasicInfo } from '../../../../features/employer/employer-profile-edit/types/employerProfile.types';
import { removeByPublicUrl } from '../lib/profile-media';

type DeleteArgs = { url?: string | null };

export function useEmployerLogoDelete() {
  const qc = useQueryClient();

  return useMutation<EmployerProfileBasicInfo, unknown, DeleteArgs>({
    mutationFn: async ({ url }) => {
      const updated = await patchEmployerBasicInfo({ imageUrl: null });

      if (url) {
        try {
          await removeByPublicUrl(url);
        } catch (e) {
          console.error('Error removing employer logo file on delete', url, e);
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
