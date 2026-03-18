import { useMemo, useState } from 'react';
import { useTalentCastingApplications } from '../hooks/useTalentCastingApplications';
import type {
  TalentCastingApplicationsFiltersState,
  TalentCastingApplicationsOrderBy,
} from '../types/talentCastingApplicationFilters.types';

const TalentCastingApplications = () => {
  const [filters] = useState<TalentCastingApplicationsFiltersState>({
    castingStatusIdTokens: undefined,
    projectTypeIdTokens: undefined,
    modalityIdTokens: undefined,
    search: undefined,
  });

  const [orderBy] = useState<TalentCastingApplicationsOrderBy>('CREATION_DATE_DESC');

  const args = useMemo(
    () => ({
      page: 0,
      size: 10,
      filters,
      orderBy,
    }),
    [filters, orderBy]
  );

  const { data } = useTalentCastingApplications(args);

  const applications = data?.items ?? [];

  console.log(applications);

  return <div>TalentCastingApplications</div>;
};

export default TalentCastingApplications;
