import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';

const EmployerCastingRemunerationEditSection = () => {
  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.remuneration.remuneration')} />
    </DashboardSection>
  );
};

export default EmployerCastingRemunerationEditSection;
