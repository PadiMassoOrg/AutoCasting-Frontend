import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import {
  TALENT_CASTING_APPLICATIONS_CACHE_KEY,
  getMyTalentApplications,
  type GetMyTalentApplicationsArgs,
} from '../services/talentCastingApplicationsService';

export const useTalentCastingApplications = (args: GetMyTalentApplicationsArgs) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [
      ...TALENT_CASTING_APPLICATIONS_CACHE_KEY,
      token ?? 'no-token',
      args.page,
      args.size,
      args.orderBy,
      JSON.stringify(args.filters ?? {}),
    ],
    queryFn: () => getMyTalentApplications(args),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
