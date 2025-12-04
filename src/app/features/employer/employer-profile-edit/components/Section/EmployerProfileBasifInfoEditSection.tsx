import { DashboardSection } from '../../../../../layouts/components';
import type { EmployerProfileBasicInfo } from '../../types/employerProfile.types';
import { EmployerBasicInfoForm } from '../Form';

const EmployerProfileBasicInfoEditSection = ({ data }: { data: EmployerProfileBasicInfo }) => {
  return (
    <DashboardSection>
      <EmployerBasicInfoForm data={data} />
    </DashboardSection>
  );
};

export default EmployerProfileBasicInfoEditSection;
