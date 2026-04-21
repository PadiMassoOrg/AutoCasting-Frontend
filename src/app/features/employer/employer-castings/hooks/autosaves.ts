import { getAuthToken } from '../../../../shared/lib/cookies';
import { useSectionAutosave } from '../../../talent/talent-profile-edit/hooks/useSectionAutoSave';
import { useEmployerCastingIds } from '../context/EmployerCastingContext';
import {
  EMPLOYER_CASTING_CACHE_KEY,
  CASTING_SECTION_BASIC_INFO_CACHE_KEY,
  CASTING_SECTION_REMUNERATIONS_CACHE_KEY,
  CASTING_SECTION_REQUIREMENTS_CACHE_KEY,
  CASTING_SECTION_ROLES_CACHE_KEY,
  createBulkRequirement,
  createNewRole,
  deleteCastingRequirement,
  deleteCastingRole,
  patchCastingBasicInfo,
  patchCastingRequirement,
  patchCastingRole,
  patchCastingRoleRemuneration,
  patchCastingSectionRemuneration,
} from '../services/employerCastingService';
import type {
  CastingSectionBasicInfo,
  CastingSectionRemunerations,
  CastingSectionRequirements,
  CastingSectionRoles,
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
  CastingRoleRemunerationPatchRequest,
  CastingRoleUpsertRequest,
  CastingSectionRemunerationPatchRequest,
} from '../types/requests';

// Basic Info
export function useCastingBasicInfoAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_BASIC_INFO_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingBasicInfoPatchRequest, CastingSectionBasicInfo>({
    mutationFn: patchCastingBasicInfo,
    delay: 800,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: false,
    onSuccessUpdate: (_prev, updated) => updated as CastingSectionBasicInfo,
  });
}

// Roles
export function useCastingRoleCreateAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_ROLES_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingRoleUpsertRequest, EmployerCastingRoleCardResponse>({
    mutationFn: createNewRole,
    delay: 200,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: 'active',
    fieldMap: {
      roleTypeId: 'roleType',
      genderId: 'gender',
    },
    onSuccessUpdate: (prev, created) => {
      const prevSection = normalizeRolesSection(prev);
      const prevRoles = prevSection.roles ?? [];
      const nextRoles = sortDescByCreatedAt([created, ...prevRoles.filter((x) => x.id !== created.id)]);
      return { ...prevSection, roles: nextRoles } as CastingSectionRoles;
    },
  });
}

export function useCastingRolePatchAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_ROLES_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingRolePatchRequest, EmployerCastingRoleCardResponse>({
    mutationFn: patchCastingRole,
    delay: 200,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: false,
    fieldMap: {
      roleTypeId: 'roleType',
      genderId: 'gender',
    },
    onSuccessUpdate: (prev, updated) => {
      const prevSection = normalizeRolesSection(prev);
      const prevRoles = prevSection.roles ?? [];
      const nextRoles = sortDescByCreatedAt(prevRoles.map((r) => (r.id === updated.id ? updated : r)));
      return { ...prevSection, roles: nextRoles } as CastingSectionRoles;
    },
  });
}

export function useCastingRoleDeleteAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_ROLES_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingRoleDeleteRequest, { id: string }>({
    mutationFn: deleteCastingRole,
    delay: 0,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: 'active',
    onSuccessUpdate: (prev, { id }) => {
      const prevSection = normalizeRolesSection(prev);
      const prevRoles = prevSection.roles ?? [];
      const nextRoles = prevRoles.filter((r) => r.id !== id);
      return { ...prevSection, roles: nextRoles } as CastingSectionRoles;
    },
  });
}

// Requirements
export function useCastingRequirementCreateAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_REQUIREMENTS_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingRequirementUpsertRequest, EmployerCastingRequirementCardResponse[]>({
    mutationFn: createBulkRequirement,
    delay: 200,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: false,
    messageFieldMap: {
      'server_error.casting.role.requirement.already_exists': 'roleIds',
      'server_error.castings.role.mismatch': 'roleIds',
    },
    onSuccessUpdate: (prev, created) => {
      const prevSection = normalizeRequirementsSection(prev);
      const prevReqs = prevSection.requirements ?? [];

      const prevArr = normalizeReqArray(prevReqs);
      const createdArr = normalizeReqArray(created);

      const map = new Map<string, EmployerCastingRequirementCardResponse>();
      [...createdArr, ...prevArr].forEach((r) => {
        if (r?.id) map.set(r.id, r);
      });

      const nextReqs = sortDescByCreatedAt(Array.from(map.values()));
      return { ...prevSection, requirements: nextReqs } as CastingSectionRequirements;
    },
  });
}

export function useCastingRequirementPatchAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_REQUIREMENTS_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingRequirementPatchRequest, EmployerCastingRequirementCardResponse>({
    mutationFn: patchCastingRequirement,
    delay: 200,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: false,
    messageFieldMap: {
      'server_error.casting.role.requirement.already_exists': 'roleIds',
      'server_error.castings.role.mismatch': 'roleIds',
    },
    onSuccessUpdate: (prev, updated) => {
      const prevSection = normalizeRequirementsSection(prev);
      const prevReqs = normalizeReqArray(prevSection.requirements ?? []);

      const nextReqs = sortDescByCreatedAt(
        prevReqs.map((r) => {
          if (r.id !== (updated as any)?.id) return r;
          return { ...r, ...(updated as any), roleName: (updated as any)?.roleName ?? (r as any)?.roleName } as any;
        })
      );

      return { ...prevSection, requirements: nextReqs } as CastingSectionRequirements;
    },
  });
}

export function useCastingRequirementDeleteAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_REQUIREMENTS_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingRequirementDeleteRequest, { id: string }>({
    mutationFn: deleteCastingRequirement,
    delay: 0,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, { id }) => {
      const prevSection = normalizeRequirementsSection(prev);
      const prevReqs = normalizeReqArray(prevSection.requirements ?? []);
      const nextReqs = prevReqs.filter((r) => r.id !== id);
      return { ...prevSection, requirements: nextReqs } as CastingSectionRequirements;
    },
  });
}

// Remunerations
export function useCastingRemunerationsSectionAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_REMUNERATIONS_CACHE_KEY, sectionId, token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingSectionRemunerationPatchRequest, CastingSectionRemunerations>({
    mutationFn: patchCastingSectionRemuneration,
    delay: 200,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: false,
    onSuccessUpdate: (prev, updated) => ({ ...(prev as any), ...(updated as any) }) as CastingSectionRemunerations,
  });
}

export function useCastingRoleRemunerationPatchAutosave(sectionId: string) {
  const token = getAuthToken();
  const key = [...CASTING_SECTION_REMUNERATIONS_CACHE_KEY, sectionId, token ?? 'no-token'];
  const lastModifiedCacheKeys = useCastingEditorLastModifiedCacheKeys();

  return useSectionAutosave<CastingRoleRemunerationPatchRequest, any>({
    mutationFn: patchCastingRoleRemuneration,
    delay: 200,
    cacheKeys: [key],
    lastModifiedCacheKeys,
    invalidateOnSuccess: 'active',
    onSuccessUpdate: (prev, updated) => {
      const prevSection = normalizeRemunerationsSection(prev);
      const prevRems = prevSection.remunerations ?? [];
      const nextRems = prevRems.map((r: any) => {
        if (r?.id !== (updated as any)?.id) return r;
        return { ...r, ...(updated as any), roleName: (r as any)?.roleName } as any;
      });
      return { ...prevSection, remunerations: nextRems } as CastingSectionRemunerations;
    },
  });
}

// Helpers
const normalizeRolesSection = (v: any): CastingSectionRoles => {
  const any = (v ?? {}) as any;
  return {
    ...(any ?? {}),
    roles: Array.isArray(any?.roles) ? any.roles : [],
  } as CastingSectionRoles;
};

const useCastingEditorLastModifiedCacheKeys = () => {
  const { defaultCode } = useEmployerCastingIds();
  return [[...EMPLOYER_CASTING_CACHE_KEY, defaultCode]];
};

const normalizeRequirementsSection = (v: any): CastingSectionRequirements => {
  const any = (v ?? {}) as any;
  return {
    ...(any ?? {}),
    requirements: Array.isArray(any?.requirements) ? any.requirements : [],
  } as CastingSectionRequirements;
};

const normalizeRemunerationsSection = (v: any): CastingSectionRemunerations => {
  const any = (v ?? {}) as any;
  return {
    ...(any ?? {}),
    remunerations: Array.isArray(any?.remunerations) ? any.remunerations : [],
  } as CastingSectionRemunerations;
};

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
