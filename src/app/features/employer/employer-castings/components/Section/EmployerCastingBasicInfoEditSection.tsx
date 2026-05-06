import { DashboardLoadingLabel } from 'autocasting-ui-library-padimasso';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useSectionBasicInfo } from '../../hooks/section/useSectionBasicInfo';
import CastingBasicInfoForm from '../Form/BasicInfo/CastingBasicInfoForm';

const EmployerCastingBasicInfoEditSection = ({ sectionId }: { sectionId: string }) => {
  const { data, isLoading, error } = useSectionBasicInfo(sectionId);

  useSyncCastingSectionStatus('basic', data?.sectionStatus);

  if (isLoading || !data) return <DashboardLoadingLabel />;
  if (error) return <ServerError />;

  return <CastingBasicInfoForm data={data} />;
};

export default EmployerCastingBasicInfoEditSection;
