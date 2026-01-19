import { Separator } from 'autocasting-ui-library-padimasso';
import { useParams } from 'react-router-dom';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { ApplySection, BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';
import { usePublicCastingDetails } from '../hooks/usePublicCastingDetails';

const PublicCastingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, error, isLoading } = usePublicCastingDetails(slug!);
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  console.log(data);

  if (isDesktop) {
    return (
      <main className="flex flex-row gap-10">
        <section>
          <BasicInfoSection data={data.basicInfoSection}></BasicInfoSection>
          <Separator className="opacity-0 my-2" />
          <RolesSection data={data.rolesSection}></RolesSection>
        </section>
        <section className="flex flex-col gap-6 min-w-[320px]">
          <EmployerInfoSection data={data.employerInfo}></EmployerInfoSection>
          <ApplySection></ApplySection>
        </section>
      </main>
    );
  }

  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-3">
      <BasicInfoSection data={data.basicInfoSection}></BasicInfoSection>
      <Separator className="opacity-0 my-1" />
      <RolesSection data={data.rolesSection}></RolesSection>
      <Separator className="opacity-20 my-4" />
      <EmployerInfoSection data={data.employerInfo}></EmployerInfoSection>
      <ApplySection></ApplySection>
    </div>
  );
};

export default PublicCastingPage;
