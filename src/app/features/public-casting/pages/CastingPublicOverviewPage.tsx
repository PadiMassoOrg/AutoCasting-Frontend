import { Separator } from 'autocasting-ui-library-padimasso';
import { useParams } from 'react-router-dom';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';
import { usePublicCastingOverview } from '../hooks/usePublicCastingOverview';

const CastingPublicOverviewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const publicOverviewQuery = usePublicCastingOverview({ slug: slug! }, { enabled: !!slug });

  if (publicOverviewQuery.isLoading || !publicOverviewQuery.data) return null;
  if (publicOverviewQuery.error) return <ServerError />;

  const casting = publicOverviewQuery.data;

  const right = (
    <>
      <EmployerInfoSection data={casting.employerInfo} />
    </>
  );

  if (isDesktop) {
    return (
      <main className="flex flex-row gap-10">
        <section className="flex-1">
          <BasicInfoSection data={casting.basicInfoSection} />
          <Separator className="opacity-0 my-2" />
          <RolesSection data={casting.rolesSection} />
        </section>
        <section className="flex flex-col gap-6 w-[350px]">{right}</section>
      </main>
    );
  }

  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-3">
      <BasicInfoSection data={casting.basicInfoSection} />
      <Separator className="opacity-0 my-1" />
      <RolesSection data={casting.rolesSection} />
      <Separator className="opacity-20 my-4" />
      {right}
    </div>
  );
};

export default CastingPublicOverviewPage;
