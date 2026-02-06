import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import { stripUndefined } from '../../../../shared/utils/stripUndefined';
import type { EmployerCastingsFiltersState } from '../components/Filter/EmployerCastingFilterMenuContent';
import type {
  CastingCardResponse,
  CastingSectionBasicInfo,
  CastingSectionRemunerations,
  CastingSectionRequirements,
  CastingSectionRoles,
  EmployerCastingRequirementCardResponse,
  EmployerCastingResponse,
  EmployerCastingRoleCardResponse,
} from '../types/employerCastings.types';
import type { EmployerCastingsOrderBy } from '../types/employerCastingsFilters.types';
import type {
  CastingBasicInfoPatchRequest,
  CastingRequirementPatchRequest,
  CastingRequirementUpsertRequest,
  CastingRolePatchRequest,
  CastingRoleRemunerationPatchRequest,
  CastingRoleUpsertRequest,
  CastingSectionRemunerationPatchRequest,
} from '../types/requests';

export const EMPLOYER_CASTINGS_LIST_CACHE_KEY = ['cache-employer-castings-list'] as const;
export const EMPLOYER_CASTING_CACHE_KEY = ['cache-employer-casting'] as const;
export const CASTING_SECTION_BASIC_INFO_CACHE_KEY = ['cache-casting-section-basic-info'] as const;
export const CASTING_SECTION_ROLES_CACHE_KEY = ['cache-casting-section-roles'] as const;
export const CASTING_SECTION_REQUIREMENTS_CACHE_KEY = ['cache-casting-section-requirements'] as const;
export const CASTING_SECTION_REMUNERATIONS_CACHE_KEY = ['cache-casting-section-remunerations'] as const;

export type GetMyCastingsArgs = {
  page: number;
  size: number;
  filters: EmployerCastingsFiltersState;
  orderBy: EmployerCastingsOrderBy;
};

// Castings
export async function getMyCastings({ page, size, filters, orderBy }: GetMyCastingsArgs) {
  const qs = new URLSearchParams();

  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('orderBy', orderBy);

  (filters.projectTypeIds ?? []).forEach((token) => qs.append('projectTypeId', token));
  (filters.statusIdTokens ?? []).forEach((token) => qs.append('statusId', token));

  const { data } = await api.get<CastingCardResponse[]>(`${API_ROUTES.EMPLOYER_CASTINGS}?${qs.toString()}`);
  return data;
}

export const getEmployerCastingDetailsBySlug = async (slug: string): Promise<EmployerCastingResponse> => {
  const response = await api.get(API_ROUTES.EMPLOYER_CASTING + `/${slug}`);
  return response.data;
};

export const createEmptyCasting = async (): Promise<string> => {
  const response = await api.post(API_ROUTES.EMPLOYER_CASTINGS);
  return response.data;
};

export async function deleteCasting({ id }: { id: string }) {
  await api.delete(`${API_ROUTES.EMPLOYER_CASTING}/${id}`);
  return { id };
}

// Casting Statuses
export const publishCasting = async ({ id }: { id: string }): Promise<EmployerCastingResponse> => {
  const response = await api.post(API_ROUTES.PUBLISH_CASTING(id));
  return response.data;
};

// Basic Info
export const getSectionBasicInfoById = async (sectionId: string): Promise<CastingSectionBasicInfo> => {
  const response = await api.get(API_ROUTES.CASTING_BASIC_INFO + `/${sectionId}`);
  return response.data;
};

export async function patchCastingBasicInfo(payload: CastingBasicInfoPatchRequest): Promise<CastingSectionBasicInfo> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.CASTING_BASIC_INFO, body);
  return data;
}

// Roles
export const createNewRole = async (payload: CastingRoleUpsertRequest): Promise<EmployerCastingRoleCardResponse> => {
  const response = await api.post(API_ROUTES.CASTING_ROLE, payload);
  return response.data;
};

export const getSectionRolesById = async (sectionId: string): Promise<CastingSectionRoles> => {
  const response = await api.get(API_ROUTES.CASTING_ROLE + `/${sectionId}`);
  return response.data;
};

export async function patchCastingRole(req: CastingRolePatchRequest) {
  const { id, ...body } = req;
  const res = await api.put(`${API_ROUTES.CASTING_ROLE}/${id}`, body);
  return res.data;
}

export async function deleteCastingRole({ id }: { id: string }) {
  await api.delete(`${API_ROUTES.CASTING_ROLE}/${id}`);
  return { id };
}

// Requirements
export const createBulkRequirement = async (
  payload: CastingRequirementUpsertRequest
): Promise<EmployerCastingRequirementCardResponse[]> => {
  const response = await api.post(API_ROUTES.CASTING_REQUIREMENT, payload);
  return response.data;
};

export const getSectionRequirementsById = async (sectionId: string): Promise<CastingSectionRequirements> => {
  const response = await api.get(API_ROUTES.CASTING_REQUIREMENT + `/${sectionId}`);
  return response.data;
};

export async function patchCastingRequirement(req: CastingRequirementPatchRequest) {
  const { id, ...body } = req;
  const res = await api.put(`${API_ROUTES.CASTING_REQUIREMENT}/${id}`, body);
  return res.data;
}

export async function deleteCastingRequirement({ id }: { id: string }) {
  await api.delete(`${API_ROUTES.CASTING_REQUIREMENT}/${id}`);
  return { id };
}

// Remunerations
export const getSectionRemunerationsById = async (sectionId: string): Promise<CastingSectionRemunerations> => {
  const response = await api.get(API_ROUTES.CASTING_REMUNERATION + `/${sectionId}`);
  return response.data;
};

export async function patchCastingSectionRemuneration(
  payload: CastingSectionRemunerationPatchRequest
): Promise<CastingSectionRemunerations> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.CASTING_REMUNERATION, body);
  return data;
}

export async function patchCastingRoleRemuneration(payload: CastingRoleRemunerationPatchRequest): Promise<any> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.CASTING_REMUNERATION_REMUENRATIONS, body);
  return data;
}
