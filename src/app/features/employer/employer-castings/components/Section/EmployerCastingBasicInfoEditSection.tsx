import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';

const EmployerCastingBasicInfoEditSection = () => {
  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.basic_info.basic_info')} />
    </DashboardSection>
  );
};

export default EmployerCastingBasicInfoEditSection;
