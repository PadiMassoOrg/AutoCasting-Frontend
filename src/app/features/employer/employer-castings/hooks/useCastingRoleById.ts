import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '../../../auth/hooks/useAuthToken';
import { getCastingRoleById, EMPLOYER_CASTING_ROLE_CACHE_KEY } from '../services/employerCastingService';
import type { CastingRoleResponse } from '../types/employerCastings.types';

const getCastingRoleByIdQueryKey = (roleId: string | null | undefined, token?: string | null) =>
  roleId
    ? [...EMPLOYER_CASTING_ROLE_CACHE_KEY, roleId, token ?? 'no-token']
    : [...EMPLOYER_CASTING_ROLE_CACHE_KEY, 'no-role-id', token ?? 'no-token'];

const getCastingRoleByIdQueryOptions = (roleId: string | null | undefined, token?: string | null) => ({
  queryKey: getCastingRoleByIdQueryKey(roleId, token),
  queryFn: () => getCastingRoleById(roleId!),
  enabled: !!roleId && !!token,
  staleTime: 0,
  refetchOnMount: 'always' as const,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

export const useCastingRoleById = (roleId?: string | null) => {
  const token = useAuthToken();

  return useQuery<CastingRoleResponse>(getCastingRoleByIdQueryOptions(roleId, token));
};
