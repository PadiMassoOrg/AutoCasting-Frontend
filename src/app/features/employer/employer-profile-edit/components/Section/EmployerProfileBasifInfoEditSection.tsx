import SectionCard from '../../../../../shared/components/SectionCard/SectionCard';
import type { EmployerProfileResponse } from '../../types/employerProfile.types';
import { EmployerBasicInfoForm } from '../Form';

const EmployerProfileBasicInfoEditSection = ({ data }: { data: EmployerProfileResponse }) => {
  return (
    <SectionCard>
      <EmployerBasicInfoForm data={data.basicInfo} profileId={data.id} />
    </SectionCard>
  );
};

export default EmployerProfileBasicInfoEditSection;
