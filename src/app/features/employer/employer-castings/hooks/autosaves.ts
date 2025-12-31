import { getAuthToken } from '../../../../shared/lib/cookies';
import { useSectionAutosave } from '../../../talent/talent-profile-edit/hooks/useSectionAutoSave';
import {
  createNewRole,
  deleteCastingRole,
  EMPLOYER_CASTING_CACHE_KEY,
  EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY,
  patchCastingBasicInfo,
  patchCastingRole,
} from '../services/employerCastingService';
import type {
  CastingBasicInfo,
  CastingResponse,
  EmployerCastingRoleCardResponse,
} from '../types/employerCastings.types';
import type {
  CastingBasicInfoPatchRequest,
  CastingRoleDeleteRequest,
  CastingRolePatchRequest,
  CastingRoleUpsertRequest,
} from '../types/requests';

export function useCastingBasicInfoAutosave(slug: string) {
  return useSectionAutosave<CastingBasicInfoPatchRequest, CastingBasicInfo>({
    mutationFn: patchCastingBasicInfo,
    delay: 800,
    onSuccessUpdate: (prev: CastingResponse, updated) => ({ ...prev, basicInfo: updated }),
    cacheKeys: [[...EMPLOYER_CASTING_CACHE_KEY, slug]],
    invalidateOnSuccess: 'active',
  });
}

export function useCastingRoleCreateAutosave(sectionId: string) {
  const token = getAuthToken();
  const rolesKey = [...EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRoleUpsertRequest, EmployerCastingRoleCardResponse>({
    mutationFn: createNewRole,
    delay: 200,
    cacheKeys: [rolesKey],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, created) => {
      const replace = (arr: EmployerCastingRoleCardResponse[]) =>
        sortDescByCreatedAt([created, ...arr.filter((x) => x.id !== created.id)]);

      if (Array.isArray(prev)) return replace(prev);
      return { ...prev, roles: replace(prev?.roles ?? []) };
    },
  });
}

export function useCastingRolePatchAutosave(sectionId: string) {
  const token = getAuthToken();
  const rolesKey = [...EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRolePatchRequest, EmployerCastingRoleCardResponse>({
    mutationFn: patchCastingRole,
    delay: 200,
    cacheKeys: [rolesKey],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, updated) => {
      const arr = Array.isArray(prev) ? prev : [];
      return sortDescByCreatedAt(arr.map((r) => (r.id === updated.id ? updated : r)));
    },
  });
}

export function useCastingRoleDeleteAutosave(sectionId: string) {
  const token = getAuthToken();
  const rolesKey = [...EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRoleDeleteRequest, { id: string }>({
    mutationFn: deleteCastingRole,
    delay: 0,
    cacheKeys: [rolesKey],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, { id }) => {
      const remove = (arr: EmployerCastingRoleCardResponse[]) => arr.filter((r) => r.id !== id);

      if (Array.isArray(prev)) return remove(prev);
      return { ...prev, roles: remove(prev?.roles ?? []) };
    },
  });
}

// HELPERS
const getCreatedTs = (r: any) => {
  const v = r?.createdAt ?? r?.creationTime ?? r?.createdDate ?? r?.creationDate;
  const ts = v ? new Date(v).getTime() : 0;
  return Number.isFinite(ts) ? ts : 0;
};

const sortDescByCreatedAt = (list: EmployerCastingRoleCardResponse[]) =>
  [...list].sort((a, b) => getCreatedTs(b) - getCreatedTs(a));
