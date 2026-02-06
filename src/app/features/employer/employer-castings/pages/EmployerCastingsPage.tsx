import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../shared/components/Section';
import { CastingCard } from '../components/Card';
import EmployerCastingsFilterBar from '../components/Filter/EmployerCastingsFilterBar';
import { useCreateEmptyCastingMutation } from '../hooks/useCreateEmptyCastingMutation';
import { useDeleteCastingMutation } from '../hooks/useDeleteCastingMutation';
import { useEmployerCastings } from '../hooks/useEmployerCastings';

const EmployerCastingsPage = () => {
  const { t } = useTranslation();
  const { data: myCastings } = useEmployerCastings();
  const { mutate: createEmptyCasting, isPending: isCreating } = useCreateEmptyCastingMutation();
  const { mutate: deleteCasting, isPending: isDeleting } = useDeleteCastingMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    (id: string) => {
      if (isDeleting) return;
      setDeletingId(id);
      deleteCasting(
        { id },
        {
          onSettled: () => {
            setDeletingId(null);
          },
        }
      );
    },
    [deleteCasting, isDeleting]
  );

  const actionButtonRender = () => (
    <Button
      className="flex flex-row items-center justify-center gap-2"
      onClick={createEmptyCasting}
      disabled={isCreating}
    >
      <Icon name="plus" variant="white" size={16} />
      <span className="text-base font-medium">{t('employer_castings.page.create_casting')}</span>
    </Button>
  );

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_castings.page.title')} action={actionButtonRender()} />

        <EmployerCastingsFilterBar></EmployerCastingsFilterBar>

        {myCastings?.length ? (
          myCastings.map((i) => (
            <CastingCard
              key={i.id}
              data={i}
              onDelete={handleDelete}
              deleteDisabled={isDeleting && deletingId === i.id}
            />
          ))
        ) : (
          <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
            {t('employer_castings.page.empty_page')}
          </Label>
        )}
      </DashboardSection>
    </DashboardShell>
  );
};

export default EmployerCastingsPage;
