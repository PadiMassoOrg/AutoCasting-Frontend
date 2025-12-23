import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DashboardSection, DashboardShell } from '../../../../layouts/components';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../shared/components/Section';
import { ROUTES } from '../../../../shared/lib/routes';

const EmployerCastingsPage = () => {
  const { t } = useTranslation();

  const actionButtonRender = () => (
    <Link to={ROUTES.EMPLOYER_NEW_CASTING}>
      <Button className="flex flex-row items-center justify-center gap-2">
        <Icon name="plus" variant="white" size={16} />
        <span className="text-base font-medium">{t('employer_castings.page.create_casting')}</span>
      </Button>
    </Link>
  );

  return (
    <DashboardShell>
      <DashboardSection>
        <SectionTitle title={t('employer_castings.page.title')} action={actionButtonRender()} />
        {/* TODO: Filter Bar */}
        {/* TODO: Render Cards */}
      </DashboardSection>
    </DashboardShell>
  );
};

export default EmployerCastingsPage;
