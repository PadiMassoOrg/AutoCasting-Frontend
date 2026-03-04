import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  return useMutation<any, unknown, Vars>({
    mutationFn: ({ applicationId }) => mutationByAction[action]({ applicationId }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [...EMPLOYER_CASTING_APPLICANTS_CACHE_KEY, variables.castingSlug],
      });
    },
  });
};
