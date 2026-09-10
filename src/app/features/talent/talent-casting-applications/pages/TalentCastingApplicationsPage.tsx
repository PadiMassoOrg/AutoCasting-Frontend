import { DashboardSection, DashboardShell, Label, Skeleton } from 'autocasting-ui-library-padimasso';
import { t } from 'i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SectionTitle } from '../../../../shared/components/Section';
import TalentCastingApplicationCard from '../components/Card/TalentCastingApplicationCard';
import TalentCastingApplicationFilterBar, {
  type TalentCastingApplicationsFiltersState,
} from '../components/Filter/TalentCastingApplicationFilterBar';
import { useTalentCastingApplications } from '../hooks/useTalentCastingApplications';
import type { TalentCastingApplicationsOrderBy } from '../types/talentCastingApplicationFilters.types';

const PAGE_SIZE = 10;

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
      size: PAGE_SIZE,
      filters,
      orderBy,
    }),
    [filters, orderBy]
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTalentCastingApplications(args);
  const applications = useMemo(() => (data?.pages ?? []).flatMap((slice) => slice.items ?? []), [data?.pages]);
  const showInitialSkeletons = isLoading && applications.length === 0;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || isFetchingNextPage) return;
        void fetchNextPage();
      },
      { root: null, rootMargin: '600px 0px 800px 0px', threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
            <>
              {applications.map((i) => (
                <TalentCastingApplicationCard key={i.castingRoleId} data={i} />
              ))}
              <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
            </>
          ) : (
            <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
              {t('talent_applied_castings.page.empty_page')}
            </Label>
          )}
        </div>

        {isFetchingNextPage && (
          <p className="py-10 text-center font-light text-(--color-secondary-grey)" aria-live="polite">
            {t('state.loading')}
          </p>
        )}
      </DashboardSection>
    </DashboardShell>
  );
};

export default TalentCastingApplications;
