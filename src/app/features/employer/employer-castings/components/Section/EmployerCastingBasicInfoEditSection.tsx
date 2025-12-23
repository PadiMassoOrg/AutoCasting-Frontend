import { t } from 'i18next';
import { CastingBasicInfoForm } from '..';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import type { CastingBasicInfo } from '../../types/employerCastings.types';

const EmployerCastingBasicInfoEditSection = ({ data }: { data: CastingBasicInfo }) => {
  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.basic_info.basic_info')} />
      <SectionCard>
        <CastingBasicInfoForm data={data}></CastingBasicInfoForm>
      </SectionCard>
    </DashboardSection>
  );
};

export default EmployerCastingBasicInfoEditSection;
