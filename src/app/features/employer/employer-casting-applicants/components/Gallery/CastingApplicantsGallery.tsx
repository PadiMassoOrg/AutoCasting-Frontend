import type { EmployerCastingApplicantCardResponse } from '../../types/employerCastingApplicants.types';
import CastingApplicantGalleryCard from '../Card/CastingApplicantGalleryCard';

type Props = {
  data: EmployerCastingApplicantCardResponse[];
};

const CastingApplicantsGallery = ({ data }: Props) => {
  return (
    <div className="">
      {data.map((applicant) => (
        <CastingApplicantGalleryCard key={applicant.applicationId} data={applicant} />
      ))}
    </div>
  );
};

export default CastingApplicantsGallery;
