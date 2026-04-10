import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../../context/ToastContext';
import { handleBackendActionError } from '../../../../../shared/utils/backendErrorHandling';
import {
  EMPLOYER_CASTING_APPLICANTS_CACHE_KEY,
  blankApplication,
  notProceedingApplication,
  preselectApplication,
  selectApplication,
  viewApplication,
} from '../../services/employerCastingApplicantsService';

export type CastingApplicationStatusAction = 'preselect' | 'select' | 'view' | 'notProceeding' | 'blank';

type Vars = { applicationId: string; castingSlug: string };

const mutationByAction: Record<CastingApplicationStatusAction, (v: { applicationId: string }) => Promise<any>> = {
  preselect: preselectApplication,
  select: selectApplication,
  view: viewApplication,
  notProceeding: notProceedingApplication,
  blank: blankApplication,
};

export const useCastingApplicationStatusMutation = (action: CastingApplicationStatusAction) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<any, unknown, Vars>({
    mutationFn: ({ applicationId }) => mutationByAction[action]({ applicationId }),
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
