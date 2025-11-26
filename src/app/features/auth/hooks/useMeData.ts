import { useQuery } from '@tanstack/react-query';
import { ME_DATA_CACHE_KEY, meData } from '../services/authService';

export const useMeData = () => {
  return useQuery({
    queryKey: ME_DATA_CACHE_KEY,
    queryFn: meData,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
