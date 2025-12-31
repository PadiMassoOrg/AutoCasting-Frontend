import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import { stripUndefined } from '../../../../shared/utils/stripUndefined';
import type {
  CastingBasicInfo,
  CastingCardResponse,
  CastingResponse,
  EmployerCastingRoleCardResponse,
} from '../types/employerCastings.types';
import type { CastingBasicInfoPatchRequest, CastingRolePatchRequest, CastingRoleRequest } from '../types/requests';

export const EMPLOYER_CASTING_CACHE_KEY = ['cache-employer-casting'] as const;
export const EMPLOYER_CASTINGS_LIST_CACHE_KEY = ['cache-employer-castings-list'] as const;
export const EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY = ['cache-employer-casting-role-list'] as const;

// GET
export const getMyCastings = async (): Promise<CastingCardResponse[]> => {
  const response = await api.get(API_ROUTES.EMPLOYER_CASTINGS);
  return response.data;
};

export const getRolesBySectionId = async (sectionId: string): Promise<EmployerCastingRoleCardResponse[]> => {
  const response = await api.get(API_ROUTES.CASTING_ROLE + `/${sectionId}`);
  return response.data;
};

export const getCastingDetailsBySlug = async (slug: string): Promise<CastingResponse> => {
  const response = await api.get(API_ROUTES.CASTING + `/${slug}`);
  return response.data;
};

// POST
export const createEmptyCasting = async (): Promise<string> => {
  const response = await api.post(API_ROUTES.EMPLOYER_CASTINGS);
  return response.data;
};

export const createNewRole = async (payload: CastingRoleRequest): Promise<EmployerCastingRoleCardResponse> => {
  const response = await api.post(API_ROUTES.CASTING_ROLE, payload);
  return response.data;
};

// PATCH & PUT
export async function patchCastingBasicInfo(payload: CastingBasicInfoPatchRequest): Promise<CastingBasicInfo> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.CASTING_BASIC_INFO, body);
  return data;
}

export async function patchCastingRole(req: CastingRolePatchRequest) {
  const { id, ...body } = req;
  const res = await api.put(`${API_ROUTES.CASTING_ROLE}/${id}`, body);
  return res.data;
}

// DELTE
export async function deleteCastingRole({ id }: { id: string }) {
  await api.delete(`${API_ROUTES.CASTING_ROLE}/${id}`);
  return { id };
}
