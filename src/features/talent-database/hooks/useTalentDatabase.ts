import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { getTalentDatabase, TALENT_DATABASE_CACHE_KEY } from '../services/talentDatabaseService';
import type { ProfileCardResponse } from '../types/talent-database.types';

export const useTalentDatabase = () => {
  const qc = useQueryClient();
  const bump = qc.getQueryState<SliceResponse<ProfileCardResponse>>(TALENT_DATABASE_CACHE_KEY)?.dataUpdatedAt ?? 0;

  return useQuery({
    queryKey: [TALENT_DATABASE_CACHE_KEY, bump],
    queryFn: () => getTalentDatabase(),
    staleTime: Infinity,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
