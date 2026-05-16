import type { EmployerProfileResponse } from '../../types/employerProfile.types';
import { EmployerBasicInfoForm } from '../Form';

const EmployerProfileBasicInfoEditSection = ({ data }: { data: EmployerProfileResponse }) => {
  return <EmployerBasicInfoForm data={data.basicInfo} profileId={data.id} />;
};

export default EmployerProfileBasicInfoEditSection;
