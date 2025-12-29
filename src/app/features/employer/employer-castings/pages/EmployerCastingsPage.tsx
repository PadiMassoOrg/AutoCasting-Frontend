import { Button } from 'autocasting-ui-library-padimasso';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../shared/components/Section';
import { CastingCard } from '../components';
import { useCreateEmptyCastingMutation } from '../hooks/useCreateEmptyCastingMutation';
import { getMyCastings } from '../services/employerCastingService';
import type { CastingCardResponse } from '../types/employerCastings.types';

const EmployerCastingsPage = () => {
  const { t } = useTranslation();
  const { mutate: createEmptyCasting, isPending } = useCreateEmptyCastingMutation();
  const [misCastings, setMyCastings] = useState<CastingCardResponse[]>([]);

  const fetchPage = useCallback(async () => {
    const data = await getMyCastings();
    setMyCastings(data);
  }, []);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

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
        {/* TODO: Render Cards */}
        {misCastings.map((i) => {
          return <CastingCard data={i} key={i.id}></CastingCard>;
        })}
      </DashboardSection>
    </DashboardShell>
  );
};

export default EmployerCastingsPage;
