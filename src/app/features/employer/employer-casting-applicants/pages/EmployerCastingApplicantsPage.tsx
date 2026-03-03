import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEmployerCastingApplicants } from '../hooks/useEmployerCastingApplicants';
import type {
  EmployerCastingApplicantsFiltersState,
  EmployerCastingApplicantsOrderBy,
} from '../types/employerCastingApplicantsFilter.types';

const EmployerCastingApplicantsPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null;

  const [filters, setFilters] = useState<EmployerCastingApplicantsFiltersState>({
    roleIds: undefined,
    applicationStatusIdTokens: undefined,
    professionIds: undefined,
    search: undefined,
  });

  const [orderBy, setOrderBy] = useState<EmployerCastingApplicantsOrderBy>('CREATION_DATE_DESC');

  const args = useMemo(
    () => ({
      slug,
      page: 0,
      size: 10,
      filters,
      orderBy,
    }),
    [slug, filters, orderBy]
  );

  const { data } = useEmployerCastingApplicants(args);

  const applicants = data?.items ?? [];
  console.log(applicants);

  return <div>{slug}</div>;
};

export default EmployerCastingApplicantsPage;
