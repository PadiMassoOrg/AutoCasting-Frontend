import { Label } from 'autocasting-ui-library-padimasso';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { SectionTitle } from '../../../../shared/components/Section';
import TalentCastingApplicationCard from '../components/Card/TalentCastingApplicationCard';
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

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('talent_applied_castings.page.title')} />

        {/* Filter Bar */}

        <div className="w-full flex flex-col flex-wrap gap-6 lg:flex-row">
          {applications.length > 0 ? (
            applications.map((i) => <TalentCastingApplicationCard key={i.castingRoleId} data={i} />)
          ) : (
            <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
              {t('talent_applied_castings.page.empty_page')}
            </Label>
          )}
        </div>
      </DashboardSection>
    </DashboardShell>
  );
};

export default TalentCastingApplications;
