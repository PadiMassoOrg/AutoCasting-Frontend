import { Label } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { SectionTitle } from '../../../../shared/components/Section';
import { CastingApplicantCard } from '../components';
import { useEmployerCastingApplicants } from '../hooks/useEmployerCastingApplicants';
import type {
  EmployerCastingApplicantsFiltersState,
  EmployerCastingApplicantsOrderBy,
} from '../types/employerCastingApplicantsFilter.types';

const EmployerCastingApplicantsPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return null;

  const [filters] = useState<EmployerCastingApplicantsFiltersState>({
    roleIds: undefined,
    applicationStatusIdTokens: undefined,
    professionIds: undefined,
    search: undefined,
  });

  const [orderBy] = useState<EmployerCastingApplicantsOrderBy>('CREATION_DATE_DESC');

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

  const title = applicants.length > 0 ? `${applicants[0].castingTitle}` : '';

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_casting_applicants.page.title') + ' ' + title} />

        {/* Filter Bar */}

        {/* Cards */}
        <div className="w-full flex flex-col flex-wrap gap-6 lg:flex-row">
          {applicants.length > 0 ? (
            applicants.map((i) => <CastingApplicantCard key={i.applicationId} data={i} />)
          ) : (
            <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
              {t('employer_casting_applicants.page.empty_page')}
            </Label>
          )}
        </div>
      </DashboardSection>
    </DashboardShell>
  );
};

export default EmployerCastingApplicantsPage;
