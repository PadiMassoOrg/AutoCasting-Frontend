import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import type {
  CastingResponse,
  CastingCardResponse,
  CastingRoleResponse,
  EmployerCastingCheckoutSummaryResponse,
  EmployerCastingEditorResponse,
} from '../types/employerCastings.types';
import {
  type EmployerCastingsFiltersState,
  type EmployerCastingsOrderBy,
} from '../types/employerCastingsFilters.types';
import type { CastingRoleRequest, CastingUpsertRequest } from '../types/requests';

export const EMPLOYER_CASTINGS_LIST_CACHE_KEY = ['cache-employer-castings-list'] as const;
export const EMPLOYER_CASTING_CACHE_KEY = ['cache-employer-casting'] as const;
export const EMPLOYER_CASTING_EDITOR_CACHE_KEY = ['cache-employer-casting-editor'] as const;
export const EMPLOYER_CASTING_ROLE_CACHE_KEY = ['cache-employer-casting-role'] as const;

export type GetMyCastingsArgs = {
  page: number;
  size: number;
  filters: EmployerCastingsFiltersState;
  orderBy: EmployerCastingsOrderBy;
};

const getData = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url);
  return response.data;
};

const postData = async <T>(url: string, payload?: unknown): Promise<T> => {
  const response = await api.post<T>(url, payload);
  return response.data;
};

const putData = async <T>(url: string, payload: unknown): Promise<T> => {
  const response = await api.put<T>(url, payload);
  return response.data;
};

const deleteVoid = async (url: string): Promise<void> => {
  await api.delete(url);
};

const appendQueryValues = (qs: URLSearchParams, key: string, values?: string[]) => {
  values?.forEach((value) => qs.append(key, value));
};

// Castings
export async function getMyCastings({ page, size, filters, orderBy }: GetMyCastingsArgs) {
  const qs = new URLSearchParams();

  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('orderBy', orderBy);

  const q = (filters.search ?? '').trim();
  if (q.length) qs.set('q', q);

  appendQueryValues(qs, 'projectTypeId', filters.projectTypeIds);
  appendQueryValues(qs, 'statusId', filters.statusIdTokens);

  return getData<CastingCardResponse[]>(`${API_ROUTES.EMPLOYER_CASTINGS}?${qs.toString()}`);
}

export const getEmployerCastingEditorBySlug = async (slug: string): Promise<EmployerCastingEditorResponse> =>
  getData<EmployerCastingEditorResponse>(API_ROUTES.EMPLOYER_CASTING_EDITOR(slug));

export const createEmptyCasting = async (): Promise<string> => postData<string>(API_ROUTES.EMPLOYER_CASTINGS_EMPTY);

export const getEmployerCastingDetailsBySlug = async (slug: string): Promise<CastingResponse> =>
  getData<CastingResponse>(API_ROUTES.EMPLOYER_CASTING_DETAILS(slug));

export const getEmployerCastingCheckoutSummary = async (
  castingId: string
): Promise<EmployerCastingCheckoutSummaryResponse> =>
  getData<EmployerCastingCheckoutSummaryResponse>(API_ROUTES.EMPLOYER_CASTING_CHECKOUT_SUMMARY(castingId));

export const updateCasting = async ({
  id,
  payload,
}: {
  id: string;
  payload: CastingUpsertRequest;
}): Promise<CastingResponse> => putData<CastingResponse>(`${API_ROUTES.EMPLOYER_CASTING}/${id}`, payload);

export const getCastingRoleById = async (roleId: string): Promise<CastingRoleResponse> =>
  getData<CastingRoleResponse>(API_ROUTES.EMPLOYER_CASTING_ROLE_DETAILS(roleId));

export const createCastingRole = async (payload: CastingRoleRequest): Promise<CastingRoleResponse> =>
  postData<CastingRoleResponse>(API_ROUTES.CASTING_ROLE, payload);

export const updateCastingRole = async ({
  roleId,
  payload,
}: {
  roleId: string;
  payload: CastingRoleRequest;
}): Promise<CastingRoleResponse> => putData<CastingRoleResponse>(`${API_ROUTES.CASTING_ROLE}/${roleId}`, payload);

export const duplicateCastingRole = async ({ roleId }: { roleId: string }): Promise<CastingRoleResponse> =>
  postData<CastingRoleResponse>(API_ROUTES.EMPLOYER_CASTING_ROLE_DUPLICATE(roleId));

export async function deleteCastingRole({ roleId }: { roleId: string }) {
  await deleteVoid(`${API_ROUTES.CASTING_ROLE}/${roleId}`);
  return { roleId };
}

export async function deleteCasting({ id }: { id: string }) {
  await deleteVoid(`${API_ROUTES.EMPLOYER_CASTING}/${id}`);
  return { id };
}

// Casting Statuses
export const publishCasting = async ({ id }: { id: string }): Promise<EmployerCastingEditorResponse> =>
  postData<EmployerCastingEditorResponse>(API_ROUTES.PUBLISH_CASTING(id));

export const setDraftCasting = async ({ id }: { id: string }): Promise<EmployerCastingEditorResponse> =>
  postData<EmployerCastingEditorResponse>(API_ROUTES.DRAFT_CASTING(id));

export const pauseCasting = async ({ id }: { id: string }): Promise<EmployerCastingEditorResponse> =>
  postData<EmployerCastingEditorResponse>(API_ROUTES.PAUSE_CASTING(id));

export const closeCasting = async ({ id }: { id: string }): Promise<EmployerCastingEditorResponse> =>
  postData<EmployerCastingEditorResponse>(API_ROUTES.CLOSE_CASTING(id));

export const archiveCasting = async ({ id }: { id: string }): Promise<EmployerCastingEditorResponse> =>
  postData<EmployerCastingEditorResponse>(API_ROUTES.ARCHIVE_CASTING(id));
