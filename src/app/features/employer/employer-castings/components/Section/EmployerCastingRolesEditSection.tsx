import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';

const EmployerCastingRolesEditSection = () => {
  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.roles.roles')} />
    </DashboardSection>
  );
};

export default EmployerCastingRolesEditSection;
