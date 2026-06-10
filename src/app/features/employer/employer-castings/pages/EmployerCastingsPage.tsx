import { DashboardSection, DashboardShell, Label, Skeleton } from 'autocasting-ui-library-padimasso';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from '../../../../shared/components/Section';
import { CastingCard } from '../components/Card';
import EmployerCastingsFilterBar from '../components/Filter/EmployerCastingsFilterBar';
import { useDeleteCastingMutation } from '../hooks/useDeleteCastingMutation';
import { useEmployerCastings } from '../hooks/useEmployerCastings';
import {
  type EmployerCastingsFiltersState,
  type EmployerCastingsOrderBy,
} from '../types/employerCastingsFilters.types';

const EmployerCastingsPage = () => {
  const { t } = useTranslation();
  const { mutate: deleteCasting, isPending: isDeletePending } = useDeleteCastingMutation();

  const [filters, setFilters] = useState<EmployerCastingsFiltersState>({
    projectTypeIds: undefined,
    statusIdTokens: undefined,
    search: undefined,
  });

  const [orderBy, setOrderBy] = useState<EmployerCastingsOrderBy>('CREATION_DATE_DESC');

  const args = useMemo(
    () => ({
      page: 0,
      size: 10,
      filters,
      orderBy,
    }),
    [filters, orderBy]
  );

  const { data: myCastings, isLoading, isFetching } = useEmployerCastings(args);
  const castings = myCastings ?? [];
  const showInitialSkeletons = (isLoading || isFetching) && myCastings == null;

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    (id: string) => {
      if (isDeletePending) return;
      setDeletingId(id);
      deleteCasting(
        { id },
        {
          onSettled: () => setDeletingId(null),
        }
      );
    },
    [deleteCasting, isDeletePending]
  );

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_castings.page.title')} />

        <EmployerCastingsFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
        />

        <div className="w-full flex flex-col flex-wrap gap-6 lg:flex-row">
          {showInitialSkeletons ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`casting-card-skeleton-${i}`} className="lg:min-w-[415px]">
                <Skeleton className="w-full h-[226px] rounded-xl" />
              </div>
            ))
          ) : castings.length > 0 ? (
            castings.map((i) => (
              <CastingCard
                key={i.id}
                data={i}
                onDelete={handleDelete}
                deleteDisabled={isDeletePending && deletingId === i.id}
              />
            ))
          ) : (
            <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
              {t('employer_castings.page.empty_page')}
            </Label>
          )}
        </div>
      </DashboardSection>
    </DashboardShell>
  );
};

export default EmployerCastingsPage;
