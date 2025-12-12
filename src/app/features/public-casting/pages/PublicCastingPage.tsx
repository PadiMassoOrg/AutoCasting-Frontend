import { Separator } from 'autocasting-ui-library-padimasso';
import { USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { getAuthToken } from '../../../shared/lib/cookies';
import { PUBLIC_CASTING_MOCK } from '../../_TEST_/mock/casting-card-mock';
import { ApplySection, BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';

const PublicCastingPage = () => {
  const data = PUBLIC_CASTING_MOCK;
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const isAuth = getAuthToken();
  const { mode } = useUserMode();

  const showApplyButton = isAuth && mode === USER_MODE_TALENT;

  if (isDesktop) {
    return (
      <main className="flex flex-row gap-10">
        <section>
          <BasicInfoSection data={data.castingBasicInfo}></BasicInfoSection>
          <Separator className="opacity-0 my-2" />
          <RolesSection data={data.castingRoles}></RolesSection>
        </section>
        <section className="flex flex-col gap-6 min-w-[320px]">
          <EmployerInfoSection data={data.employerInfo}></EmployerInfoSection>
          {showApplyButton && <ApplySection token={isAuth}></ApplySection>}
        </section>
      </main>
    );
  }
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
