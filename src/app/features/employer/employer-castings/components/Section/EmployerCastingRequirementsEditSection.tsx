import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';

const EmployerCastingRequirementsEditSection = () => {
  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.requirements.requirements')} />
    </DashboardSection>
  );
};

export default EmployerCastingRequirementsEditSection;
