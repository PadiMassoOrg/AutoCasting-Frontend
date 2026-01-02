import { getAuthToken } from '../../../../shared/lib/cookies';
import { useSectionAutosave } from '../../../talent/talent-profile-edit/hooks/useSectionAutoSave';
import {
  createBulkRequirement,
  createNewRole,
  deleteCastingRequirement,
  deleteCastingRole,
  EMPLOYER_CASTING_CACHE_KEY,
  EMPLOYER_CASTING_REQUIREMENTS_LIST_CACHE_KEY,
  EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY,
  patchCastingBasicInfo,
  patchCastingRequirement,
  patchCastingRole,
} from '../services/employerCastingService';
import type {
  CastingBasicInfo,
  CastingResponse,
  EmployerCastingRequirementCardResponse,
  EmployerCastingRoleCardResponse,
} from '../types/employerCastings.types';
import type {
  CastingBasicInfoPatchRequest,
  CastingRequirementDeleteRequest,
  CastingRequirementPatchRequest,
  CastingRequirementUpsertRequest,
  CastingRoleDeleteRequest,
  CastingRolePatchRequest,
  CastingRoleUpsertRequest,
} from '../types/requests';

// Basic Info
export function useCastingBasicInfoAutosave(slug: string) {
  return useSectionAutosave<CastingBasicInfoPatchRequest, CastingBasicInfo>({
    mutationFn: patchCastingBasicInfo,
    delay: 800,
    onSuccessUpdate: (prev: CastingResponse, updated) => ({ ...prev, basicInfo: updated }),
    cacheKeys: [[...EMPLOYER_CASTING_CACHE_KEY, slug]],
    invalidateOnSuccess: 'active',
  });
}

// Role
export function useCastingRoleCreateAutosave(sectionId: string) {
  const token = getAuthToken();
  const rolesKey = [...EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRoleUpsertRequest, EmployerCastingRoleCardResponse>({
    mutationFn: createNewRole,
    delay: 200,
    cacheKeys: [rolesKey],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, created) => {
      const prevArr = Array.isArray(prev) ? prev : [];
      return sortDescByCreatedAt([created, ...prevArr.filter((x) => x.id !== created.id)]);
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
      const arr = Array.isArray(prev) ? prev : [];
      return arr.filter((r) => r.id !== id);
    },
  });
}

// Requirement
export function useCastingRequirementCreateAutosave(sectionId: string) {
  const token = getAuthToken();
  const requirementsKey = [...EMPLOYER_CASTING_REQUIREMENTS_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRequirementUpsertRequest, EmployerCastingRequirementCardResponse[]>({
    mutationFn: createBulkRequirement,
    delay: 200,
    cacheKeys: [requirementsKey],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, created) => {
      const prevArr = normalizeReqArray(prev);
      const createdArr = normalizeReqArray(created);
      const map = new Map<string, EmployerCastingRequirementCardResponse>();
      [...createdArr, ...prevArr].forEach((r) => {
        if (r?.id) map.set(r.id, r);
      });
      return sortDescByCreatedAt(Array.from(map.values()));
    },
  });
}

export function useCastingRequirementPatchAutosave(sectionId: string) {
  const token = getAuthToken();
  const requirementsKey = [...EMPLOYER_CASTING_REQUIREMENTS_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRequirementPatchRequest, EmployerCastingRequirementCardResponse>({
    mutationFn: patchCastingRequirement,
    delay: 200,
    cacheKeys: [requirementsKey],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, updated) => {
      const arr = normalizeReqArray(prev);

      // Importante: si el backend devuelve un DTO "corto" (sin roleName/sectionId),
      // hacemos merge con el item existente para no romper la UI.
      const next = arr.map((r) => (r.id === (updated as any)?.id ? ({ ...r, ...(updated as any) } as any) : r));

      return sortDescByCreatedAt(next);
    },
  });
}

export function useCastingRequirementDeleteAutosave(sectionId: string) {
  const token = getAuthToken();
  const requirementsKey = [...EMPLOYER_CASTING_REQUIREMENTS_LIST_CACHE_KEY, sectionId, token ?? 'no-token'];

  return useSectionAutosave<CastingRequirementDeleteRequest, { id: string }>({
    mutationFn: deleteCastingRequirement,
    delay: 0,
    cacheKeys: [requirementsKey],
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, { id }) => {
      const arr = normalizeReqArray(prev);
      return arr.filter((r) => r.id !== id);
    },
  });
}

// === Helpers ===
const normalizeReqArray = (v: any): EmployerCastingRequirementCardResponse[] => {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v.flatMap((x) => (Array.isArray(x) ? x : [x])).filter((x) => x && typeof x.id === 'string');
  }
  return [];
};

const getCreatedTs = (r: any) => {
  const v = r?.createdAt ?? r?.creationTime ?? r?.createdDate ?? r?.creationDate;
  const ts = v ? new Date(v).getTime() : 0;
  return Number.isFinite(ts) ? ts : 0;
};

const sortDescByCreatedAt = <T extends any>(list: T[]) =>
  [...list].sort((a: any, b: any) => getCreatedTs(b) - getCreatedTs(a));
