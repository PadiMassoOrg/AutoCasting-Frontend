import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import type { SliceResponse } from '../../../../shared/types/sliceResponse.types';
import type { TalentCastingApplicationCardResponse } from '../types/talentCastingApplication.types';
import type {
  TalentCastingApplicationsFiltersState,
  TalentCastingApplicationsOrderBy,
} from '../types/talentCastingApplicationFilters.types';

export const TALENT_CASTING_APPLICATIONS_CACHE_KEY = ['cache-talent-casting-applications'] as const;

export type GetMyTalentApplicationsArgs = {
  page: number;
  size: number;
  filters: TalentCastingApplicationsFiltersState;
  orderBy: TalentCastingApplicationsOrderBy;
};

export async function getMyTalentApplications({ page, size, filters, orderBy }: GetMyTalentApplicationsArgs) {
  const qs = new URLSearchParams();

  qs.set('page', String(page));
  qs.set('size', String(size));
  qs.set('orderBy', orderBy);

  const q = (filters.search ?? '').trim();
  if (q.length) qs.set('q', q);

  (filters.castingStatusIdTokens ?? []).forEach((token: string) => qs.append('castingStatusId', token));
  (filters.projectTypeIdTokens ?? []).forEach((token: string) => qs.append('projectTypeId', token));
  (filters.modalityIdTokens ?? []).forEach((token: string) => qs.append('modalityId', token));

  const { data } = await api.get<SliceResponse<TalentCastingApplicationCardResponse>>(
    `${API_ROUTES.TALENT_CASTING_APPLICATIONS}?${qs.toString()}`
  );

  return data;
}
