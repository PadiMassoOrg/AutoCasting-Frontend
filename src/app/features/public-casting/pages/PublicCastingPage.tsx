import { LG_SCREEN_SIZE, useMedia, XL_SCREEN_SIZE } from '../../../shared/hooks/useMedia';
import { PUBLIC_CASTING_MOCK } from '../../casting-database/mock/casting-card-mock';
import type { CastingResponse } from '../../employer/employer-castings/types/employerCastings.types';

const PublicCastingPage = () => {
  const data = PUBLIC_CASTING_MOCK as CastingResponse;
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isDesktopXL = useMedia(XL_SCREEN_SIZE);

  // Mobile
  return (
    <>
      {/* 
    BASIC INFO

    Title 
    projectType castingModality
    location (SOLO SI MODALITY PRESENCIAL)
    deadline
    shooting - shoooting end
    description
    */}

      {/* 
    CASTING ROLE LIST
    name 
    professions x2 - roleType - gender - ageminMax
    description 

    Characteristics:
    Facilito

    Skills:
    Facilito

    Remuneration (sin remuneracion: mostrar "no remunerado"):
    amount currency payRateType

    */}

      {/* Separator */}

      {/* Employer Card
    Logo Name CompanyType
    Amount Castings
    Member Since
    Separator 
    RRSS
    */}

      <div>{data.castingBasicInfo.title}</div>
    </>
  );
};

export default PublicCastingPage;
