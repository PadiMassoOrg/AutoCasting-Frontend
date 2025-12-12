import { Separator } from 'autocasting-ui-library-padimasso';
import { USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import { getAuthToken } from '../../../shared/lib/cookies';
import { PUBLIC_CASTING_MOCK } from '../../_TEST_/mock/casting-card-mock';
import { ApplySection, BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';

const PublicCastingPage = () => {
  const isAuth = getAuthToken();
  const { mode } = useUserMode();
  const data = PUBLIC_CASTING_MOCK;

  const showApplyButton = isAuth && mode === USER_MODE_TALENT;

  // Mobile
  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-3">
      <BasicInfoSection data={data.castingBasicInfo}></BasicInfoSection>
      <Separator className="opacity-0 my-1" />
      <RolesSection data={data.castingRoles}></RolesSection>
      <Separator className="opacity-20 my-4" />
      <EmployerInfoSection data={data.employerInfo}></EmployerInfoSection>
      {showApplyButton && <ApplySection token={isAuth}></ApplySection>}
    </div>
  );
};

export default PublicCastingPage;
