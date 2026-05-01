import {
  DashboardLoadingLabel,
  DashboardSection,
  LG_SCREEN_SIZE,
  SectionCard,
  useMedia,
} from 'autocasting-ui-library-padimasso';
import { t } from 'i18next';
import { SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useSectionBasicInfo } from '../../hooks/section/useSectionBasicInfo';
import CastingBasicInfoForm from '../Form/BasicInfo/CastingBasicInfoForm';

const EmployerCastingBasicInfoEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionBasicInfo(sectionId);
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  useSyncCastingSectionStatus('basic', data?.sectionStatus);

  if (isLoading || !data) {
    return (
      <DashboardSection>
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }
  if (error) return <ServerError />;

  return (
    <DashboardSection>
      {!isDesktop && <SectionTitle title={t('employer_castings.dashboard.basic_info.basic_info')} />}
      <SectionCard>
        <CastingBasicInfoForm data={data} />
      </SectionCard>
    </DashboardSection>
  );
};

export default EmployerCastingBasicInfoEditSection;
