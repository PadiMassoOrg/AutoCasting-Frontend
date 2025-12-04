import { DashboardSection } from '../../../../../layouts/components';
import type { EmployerProfileResponse } from '../../types/employerProfile.types';
import { EmployerBasicInfoForm } from '../Form';

const EmployerProfileBasicInfoEditSection = ({ data }: { data: EmployerProfileResponse }) => {
  return (
    <DashboardSection>
      <EmployerBasicInfoForm data={data.basicInfo} profileId={data.id} />
    </DashboardSection>
  );
};

export default EmployerProfileBasicInfoEditSection;
