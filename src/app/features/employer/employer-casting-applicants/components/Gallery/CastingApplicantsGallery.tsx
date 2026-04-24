import { useState } from 'react';
import type { EmployerCastingApplicantCardResponse } from '../../types/employerCastingApplicants.types';
import CastingApplicantGalleryCard from '../Card/CastingApplicantGalleryCard';

type Props = {
  data: EmployerCastingApplicantCardResponse[];
};

const CastingApplicantsGallery = ({ data }: Props) => {
  const [gridCols, setGridCols] = useState(1);
  return (
    <div className="">
      {data.map((applicant) => (
        <CastingApplicantGalleryCard key={applicant.applicationId} data={applicant} />
      ))}
    </div>
  );
};

export default CastingApplicantsGallery;
