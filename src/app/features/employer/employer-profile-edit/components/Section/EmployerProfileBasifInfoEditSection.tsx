import { SectionCard } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { DashboardSection } from 'autocasting-ui-library-padimasso';
import { SectionTitle } from '../../../../../shared/components/Section';
import type { EmployerProfileResponse } from '../../types/employerProfile.types';
import { EmployerBasicInfoForm } from '../Form';

const EmployerProfileBasicInfoEditSection = ({ data }: { data: EmployerProfileResponse }) => {
  const { t } = useTranslation();

  return (
    <DashboardSection className="max-w-[850px] m-auto">
      <SectionTitle title={t('profile.page.profile')} />
      <SectionCard>
        <EmployerBasicInfoForm data={data.basicInfo} profileId={data.id} />
      </SectionCard>
    </DashboardSection>
  );
};

export default EmployerProfileBasicInfoEditSection;
