import { getAuthToken } from '../../../../shared/lib/cookies';
import { useSectionAutosave } from '../../../talent/talent-profile-edit/hooks/useSectionAutoSave';
import {
  createNewRole,
  EMPLOYER_CASTING_CACHE_KEY,
  EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY,
  patchCastingBasicInfo,
} from '../services/employerCastingService';
import type {
  CastingBasicInfo,
  CastingResponse,
  EmployerCastingRoleCardResponse,
} from '../types/employerCastings.types';
import type { CastingBasicInfoPatchRequest, CastingRoleRequest } from '../types/requests';

export function useCastingBasicInfoAutosave(slug: string) {
  return useSectionAutosave<CastingBasicInfoPatchRequest, CastingBasicInfo>({
    mutationFn: patchCastingBasicInfo,
    delay: 800,
    onSuccessUpdate: (prev: CastingResponse, updated) => ({ ...prev, basicInfo: updated }),
    cacheKeys: [[...EMPLOYER_CASTING_CACHE_KEY, slug]],
    invalidateOnSuccess: 'active',
  });
}

const createdAtMs = (r: { createdAt?: string | null; creationTime?: string | null }) => {
  const v = r.createdAt ?? r.creationTime;
  const ms = v ? Date.parse(v) : 0;
  return Number.isFinite(ms) ? ms : 0;
};

const sortDescByCreatedAt = (list: EmployerCastingRoleCardResponse[]) =>
  [...list].sort((a, b) => createdAtMs(b) - createdAtMs(a));

const dedupeByIdKeepFirst = (list: EmployerCastingRoleCardResponse[]) => {
  const map = new Map<string, EmployerCastingRoleCardResponse>();
  for (const item of list) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return Array.from(map.values());
};

export function useCastingRoleAutosave(sectionId: string) {
  const token = getAuthToken();
  const rolesKey = [...EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRoleRequest, EmployerCastingRoleCardResponse>({
    mutationFn: createNewRole,
    delay: 200,
    cacheKeys: [rolesKey],
    invalidateOnSuccess: 'active',
    onSuccessUpdate: (prev, created) => {
      if (Array.isArray(prev)) {
        return sortDescByCreatedAt(dedupeByIdKeepFirst([created, ...prev]));
      }

      const nextRoles = sortDescByCreatedAt(dedupeByIdKeepFirst([created, ...(prev?.roles ?? [])]));
      return { ...prev, roles: nextRoles };
    },
  });
}
