import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import type { SliceResponse } from '../../../../shared/types/sliceResponse.types';
import type { EmployerCastingApplicantCardResponse } from '../types/employerCastingApplicants.types';
import type {
  EmployerCastingApplicantsFiltersState,
  EmployerCastingApplicantsOrderBy,
} from '../types/employerCastingApplicantsFilter.types';

export const EMPLOYER_CASTING_APPLICANTS_CACHE_KEY = ['cache-employer-casting-applicants'] as const;

export type GetEmployerApplicantsArgs = {
  slug: string;
  page: number;
  size: number;
  filters: EmployerCastingApplicantsFiltersState;
  orderBy: EmployerCastingApplicantsOrderBy;
};

export const getEmployerCastingApplicantsQueryKey = ({
  slug,
  page,
  size,
  filters,
  orderBy,
}: GetEmployerApplicantsArgs) =>
  [...EMPLOYER_CASTING_APPLICANTS_CACHE_KEY, slug, page, size, orderBy, JSON.stringify(filters ?? {})] as const;

export async function getEmployerApplicantsByCastingSlug({
  slug,
  page,
  size,
  filters,
  orderBy,
}: GetEmployerApplicantsArgs) {
  const qs = new URLSearchParams();

  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('orderBy', orderBy);

  const q = (filters.search ?? '').trim();
  if (q.length) qs.set('q', q);

  (filters.applicationStatusIdTokens ?? []).forEach((token: string) => qs.append('applicationStatusId', token));
  (filters.professionIds ?? []).forEach((id: string) => qs.append('professionId', id));

  const { data } = await api.get<SliceResponse<EmployerCastingApplicantCardResponse>>(
    API_ROUTES.EMPLOYER_CASTING_APPLICANTS(slug) + `?${qs.toString()}`
  );

  return data;
}

// =========================
// Application Status actions
// =========================
export async function preselectApplication({ applicationId }: { applicationId: string }) {
  const res = await api.post(API_ROUTES.PRESELECT_APPLICATION(applicationId));
  return res.data;
}

export async function selectApplication({ applicationId }: { applicationId: string }) {
  const res = await api.post(API_ROUTES.SELECT_APPLICATION(applicationId));
  return res.data;
}

export async function viewApplication({ applicationId }: { applicationId: string }) {
  const res = await api.post(API_ROUTES.VIEW_APPLICATION(applicationId));
  return res.data;
}

export async function notProceedingApplication({ applicationId }: { applicationId: string }) {
  const res = await api.post(API_ROUTES.NOT_PROCEEDING_APPLICATION(applicationId));
  return res.data;
}

export async function blankApplication({ applicationId }: { applicationId: string }) {
  const res = await api.post(API_ROUTES.BLANK_APPLICATION(applicationId));
  return res.data;
}
