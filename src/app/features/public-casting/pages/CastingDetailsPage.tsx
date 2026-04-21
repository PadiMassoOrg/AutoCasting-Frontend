import { Separator } from 'autocasting-ui-library-padimasso';
import { useParams } from 'react-router-dom';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import { ApplySection, BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';
import { useEmployerCastingDetails } from '../hooks/useEmployerCastingDetails';
import { usePublicCastingDetails } from '../hooks/usePublicCastingDetails';
type Props = { mode: 'public' | 'employer' };

const CastingDetailsPage = ({ mode }: Props) => {
  const { slug, roleId } = useParams<{ slug: string; roleId?: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const employerQuery = useEmployerCastingDetails({ slug: slug! }, { enabled: mode === 'employer' && !!slug });
  const publicQuery = usePublicCastingDetails(
    { slug: slug!, roleId: roleId! },
    { enabled: mode === 'public' && !!slug && !!roleId }
  );

  if (mode === 'employer') {
    if (employerQuery.isLoading || !employerQuery.data) return null;
    if (employerQuery.error) return <ServerError />;

    const casting = employerQuery.data;
    const right = (
      <>
        <EmployerInfoSection data={casting.employerInfo} />
        <ApplySection
          employer={casting.employerInfo.companyName!}
          requirements={casting.requirementsSection.requirements ?? []}
          roleId={roleId ?? ''}
          alreadyApplied={false}
        />
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
      <div className="relative pt-3 pb-10 flex flex-col gap-3">
        <BasicInfoSection data={casting.basicInfoSection} />
        <Separator className="opacity-0 my-1" />
        <RolesSection data={casting.rolesSection} />
        <Separator className="opacity-20 my-4" />
        {right}
      </div>
    );
  }

  if (publicQuery.isLoading || !publicQuery.data) return null;
  if (publicQuery.error) return <ServerError />;

  const casting = publicQuery.data.casting;
  const alreadyApplied = Boolean(publicQuery.data.alreadyApplied);

  const right = (
    <>
      <EmployerInfoSection data={casting.employerInfo} />
      <ApplySection
        employer={casting.employerInfo.companyName!}
        requirements={casting.requirementsSection.requirements ?? []}
        roleId={roleId!}
        alreadyApplied={alreadyApplied}
      />
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

export default CastingDetailsPage;
