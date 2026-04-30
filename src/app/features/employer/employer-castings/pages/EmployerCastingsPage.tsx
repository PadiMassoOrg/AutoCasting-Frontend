import { Button, Icon, Label, Skeleton } from 'autocasting-ui-library-padimasso';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSection, DashboardShell } from 'autocasting-ui-library-padimasso';
import { SectionTitle } from '../../../../shared/components/Section';
import { CastingCard } from '../components/Card';
import EmployerCastingsFilterBar, {
  type EmployerCastingsFiltersState,
} from '../components/Filter/EmployerCastingsFilterBar';
import { useCreateEmptyCastingMutation } from '../hooks/useCreateEmptyCastingMutation';
import { useDeleteCastingMutation } from '../hooks/useDeleteCastingMutation';
import { useEmployerCastings } from '../hooks/useEmployerCastings';
import type { EmployerCastingsOrderBy } from '../types/employerCastingsFilters.types';

const EmployerCastingsPage = () => {
  const { t } = useTranslation();
  const { mutate: createEmptyCasting, isPending: isCreatePending } = useCreateEmptyCastingMutation();
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

  const actionButtonRender = () => (
    <Button
      className="flex flex-row items-center justify-center gap-2"
      onClick={createEmptyCasting}
      loading={isCreatePending}
    >
      <Icon name="plus" variant="white" size={16} />
      <span className="text-base font-medium">{t('employer_castings.page.create_casting')}</span>
    </Button>
  );

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_castings.page.title')} action={actionButtonRender()} />

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
