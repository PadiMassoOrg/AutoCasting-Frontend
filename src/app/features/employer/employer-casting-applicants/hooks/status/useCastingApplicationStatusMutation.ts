import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../../context/ToastContext';
import { handleBackendActionError } from '../../../../../shared/utils/backendErrorHandling';
import {
  EMPLOYER_CASTING_APPLICANTS_CACHE_KEY,
  blankApplication,
  bulkSetApplicationsStatus,
  notProceedingApplication,
  preselectApplication,
  selectApplication,
  viewApplication,
} from '../../services/employerCastingApplicantsService';

export type CastingApplicationStatusAction = 'preselect' | 'select' | 'view' | 'notProceeding' | 'blank' | 'bulk';

type Vars = {
  castingSlug: string;
  applicationId?: string;
  applicationIds?: string[];
  applicationStatus?: string;
};

export const useCastingApplicationStatusMutation = (action: CastingApplicationStatusAction) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<any, unknown, Vars>({
    mutationFn: (vars) => {
      if (action === 'bulk') {
        return bulkSetApplicationsStatus({
          applicationIds: vars.applicationIds ?? [],
          applicationStatus: vars.applicationStatus ?? '',
        });
      }

      if (!vars.applicationId) throw new Error('applicationId is required');

      switch (action) {
        case 'preselect':
          return preselectApplication({ applicationId: vars.applicationId });
        case 'select':
          return selectApplication({ applicationId: vars.applicationId });
        case 'view':
          return viewApplication({ applicationId: vars.applicationId });
        case 'notProceeding':
          return notProceedingApplication({ applicationId: vars.applicationId });
        case 'blank':
          return blankApplication({ applicationId: vars.applicationId });
        default:
          return Promise.resolve();
      }
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...EMPLOYER_CASTING_APPLICANTS_CACHE_KEY, variables.castingSlug],
        exact: false,
      });
    },
    onError: (error) => {
      handleBackendActionError({
        error,
        t,
        showToast: (message) =>
          showToast({
            title: t('general.error'),
            description: message,
            type: 'danger',
          }),
      });
    },
  });
};
