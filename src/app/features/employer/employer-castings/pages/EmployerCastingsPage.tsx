import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../shared/components/Section';
import { CastingCard } from '../components';
import { useCreateEmptyCastingMutation } from '../hooks/useCreateEmptyCastingMutation';
import { useEmployerCastings } from '../hooks/useEmployerCastings';

const EmployerCastingsPage = () => {
  const { t } = useTranslation();
  const { data: myCastings, isLoading } = useEmployerCastings();
  const { mutate: createEmptyCasting, isPending } = useCreateEmptyCastingMutation();

  const actionButtonRender = () => (
    <Button
      className="flex flex-row items-center justify-center gap-2"
      onClick={createEmptyCasting}
      disabled={isPending}
    >
      <Icon name="plus" variant="white" size={16} />
      <span className="text-base font-medium">{t('employer_castings.page.create_casting')}</span>
    </Button>
  );

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_castings.page.title')} action={actionButtonRender()} />
        {/* TODO: Filter Bar */}
        {myCastings?.length! > 0 ? (
          myCastings?.map((i) => {
            return <CastingCard data={i} key={i.id}></CastingCard>;
          })
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
