import { useQuery } from '@tanstack/react-query';
import { getRawAuthToken } from '../../../../shared/lib/cookies';
import {
  TALENT_CASTING_APPLICATIONS_CACHE_KEY,
  getMyTalentApplications,
  type GetMyTalentApplicationsArgs,
} from '../services/talentCastingApplicationsService';

export const useTalentCastingApplications = (args: GetMyTalentApplicationsArgs) => {
  const token = getRawAuthToken();

  return useQuery({
    queryKey: [
      ...TALENT_CASTING_APPLICATIONS_CACHE_KEY,
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
