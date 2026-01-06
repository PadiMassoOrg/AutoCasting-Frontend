import { t } from 'i18next';
import { CastingBasicInfoForm } from '..';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useSectionBasicInfo } from '../../hooks/useSectionBasicInfo';

const EmployerCastingBasicInfoEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionBasicInfo(sectionId);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  console.log(data.sectionStatus?.stringCode);

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
