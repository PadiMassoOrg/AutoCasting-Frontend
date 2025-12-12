import { Separator } from 'autocasting-ui-library-padimasso';
import { LG_SCREEN_SIZE, useMedia, XL_SCREEN_SIZE } from '../../../shared/hooks/useMedia';
import { PUBLIC_CASTING_MOCK } from '../../_TEST_/mock/casting-card-mock';
import { BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';

const PublicCastingPage = () => {
  const data = PUBLIC_CASTING_MOCK;
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isDesktopXL = useMedia(XL_SCREEN_SIZE);

  // Mobile
  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-3">
      <BasicInfoSection data={data.castingBasicInfo}></BasicInfoSection>
      <Separator className="opacity-0 my-1" />
      <RolesSection data={data.castingRoles}></RolesSection>
      <Separator className="opacity-20 my-4" />
      <EmployerInfoSection data={data.employerInfo}></EmployerInfoSection>

      {/* Employer Card
    Logo Name CompanyType
    Amount Castings
    Member Since
    Separator 
    RRSS
    */}
    </div>
  );
};

export default PublicCastingPage;
