import { t } from 'i18next';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useSectionBasicInfo } from '../../hooks/section/useSectionBasicInfo';
import CastingBasicInfoForm from '../Form/BasicInfo/CastingBasicInfoForm';

const EmployerCastingBasicInfoEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionBasicInfo(sectionId);

  useSyncCastingSectionStatus('basic', data?.sectionStatus);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.basic_info.basic_info')} />
      <SectionCard>
        <CastingBasicInfoForm data={data} />
      </SectionCard>
    </DashboardSection>
  );
};

export default EmployerCastingBasicInfoEditSection;
