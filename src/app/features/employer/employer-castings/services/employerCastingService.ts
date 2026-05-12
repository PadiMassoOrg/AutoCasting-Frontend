import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import type { EmployerCastingsFiltersState } from '../components/Filter/EmployerCastingsFilterBar';
import type {
  CastingCardResponse,
  EmployerCastingDetailsResponse,
  EmployerCastingStatusResponse,
} from '../types/employerCastings.types';
import type { EmployerCastingsOrderBy } from '../types/employerCastingsFilters.types';
import type { CastingUpsertRequest } from '../types/requests';

export const EMPLOYER_CASTINGS_LIST_CACHE_KEY = ['cache-employer-castings-list'] as const;
export const EMPLOYER_CASTING_CACHE_KEY = ['cache-employer-casting'] as const;

export type GetMyCastingsArgs = {
  page: number;
  size: number;
  filters: EmployerCastingsFiltersState;
  orderBy: EmployerCastingsOrderBy;
  search?: string;
};

// Castings
export async function getMyCastings({ page, size, filters, orderBy }: GetMyCastingsArgs) {
  const qs = new URLSearchParams();

  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('orderBy', orderBy);

  const q = (filters.search ?? '').trim();
  if (q.length) qs.set('q', q);

  (filters.projectTypeIds ?? []).forEach((token: string) => qs.append('projectTypeId', token));
  (filters.statusIdTokens ?? []).forEach((token: string) => qs.append('statusId', token));

  const { data } = await api.get<CastingCardResponse[]>(`${API_ROUTES.EMPLOYER_CASTINGS}?${qs.toString()}`);
  return data;
}

export const getEmployerCastingDetailsBySlug = async (slug: string): Promise<EmployerCastingDetailsResponse> => {
  const response = await api.get(API_ROUTES.EMPLOYER_CASTING + `/${slug}` + '/details');
  return response.data;
};

export const createCasting = async (payload: CastingUpsertRequest): Promise<EmployerCastingDetailsResponse> => {
  const response = await api.post(API_ROUTES.EMPLOYER_CASTINGS, payload);
  return response.data;
};

export const updateCasting = async ({
  id,
  payload,
}: {
  id: string;
  payload: CastingUpsertRequest;
}): Promise<EmployerCastingDetailsResponse> => {
  const response = await api.put(`${API_ROUTES.EMPLOYER_CASTING}/${id}`, payload);
  return response.data;
};

export async function deleteCasting({ id }: { id: string }) {
  await api.delete(`${API_ROUTES.EMPLOYER_CASTING}/${id}`);
  return { id };
}

// Casting Statuses
export const publishCasting = async ({ id }: { id: string }): Promise<EmployerCastingStatusResponse> => {
  const response = await api.post(API_ROUTES.PUBLISH_CASTING(id));
  return response.data;
};

export const setDraftCasting = async ({ id }: { id: string }): Promise<EmployerCastingStatusResponse> => {
  const response = await api.post(API_ROUTES.DRAFT_CASTING(id));
  return response.data;
};

export const pauseCasting = async ({ id }: { id: string }): Promise<EmployerCastingStatusResponse> => {
  const response = await api.post(API_ROUTES.PAUSE_CASTING(id));
  return response.data;
};

export const closeCasting = async ({ id }: { id: string }): Promise<EmployerCastingStatusResponse> => {
  const response = await api.post(API_ROUTES.CLOSE_CASTING(id));
  return response.data;
};

export const archiveCasting = async ({ id }: { id: string }): Promise<EmployerCastingStatusResponse> => {
  const response = await api.post(API_ROUTES.ARCHIVE_CASTING(id));
  return response.data;
};
