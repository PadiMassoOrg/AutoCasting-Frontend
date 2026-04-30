import { Label, Skeleton } from 'autocasting-ui-library-padimasso';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import { DashboardSection, DashboardShell } from 'autocasting-ui-library-padimasso';
import { SectionTitle } from '../../../../shared/components/Section';
import TalentCastingApplicationCard from '../components/Card/TalentCastingApplicationCard';
import TalentCastingApplicationFilterBar, {
  type TalentCastingApplicationsFiltersState,
} from '../components/Filter/TalentCastingApplicationFilterBar';
import { useTalentCastingApplications } from '../hooks/useTalentCastingApplications';
import type { TalentCastingApplicationsOrderBy } from '../types/talentCastingApplicationFilters.types';

const TalentCastingApplications = () => {
  const [filters, setFilters] = useState<TalentCastingApplicationsFiltersState>({
    castingStatusIdTokens: undefined,
    projectTypeIdTokens: undefined,
    modalityIdTokens: undefined,
    search: undefined,
  });

  const [orderBy, setOrderBy] = useState<TalentCastingApplicationsOrderBy>('CREATION_DATE_DESC');

  const args = useMemo(
    () => ({
      page: 0,
      size: 10,
      filters,
      orderBy,
    }),
    [filters, orderBy]
  );

  const { data, isLoading } = useTalentCastingApplications(args);
  const applications = data?.items ?? [];
  const showInitialSkeletons = isLoading && applications.length === 0;

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('talent_applied_castings.page.title')} />

        <TalentCastingApplicationFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
        />

        <div className="w-full flex flex-col flex-wrap gap-6 lg:flex-row">
          {showInitialSkeletons ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`application-card-skeleton-${i}`} className="lg:min-w-[415px]">
                <Skeleton className="h-[226px] w-full rounded-xl" />
              </div>
            ))
          ) : applications.length > 0 ? (
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
