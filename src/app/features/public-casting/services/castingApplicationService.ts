import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { CastingApplicationRequest } from '../types/requests';

export const TALENT_CASTING_APPLICATION_CACHE_KEY = ['cache-talent-casting-application'] as const;

export async function applyToCastingRole(roleId: string, request?: CastingApplicationRequest): Promise<void> {
  await api.post(`${API_ROUTES.TALENT_CASTING_APPLICATION}/${roleId}`, request ?? undefined);
}
