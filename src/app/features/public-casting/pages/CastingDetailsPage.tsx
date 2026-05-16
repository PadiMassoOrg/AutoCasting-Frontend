import { Label, Separator } from 'autocasting-ui-library-padimasso';
import { LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ServerError from '../../../shared/components/ServerError/ServerError';
import { ApplySection, BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';
import { usePublicCastingDetails } from '../hooks/usePublicCastingDetails';
import type { CastingRequirement, CastingRole } from '../types/publicCasting.types';

const CastingDetailsPage = () => {
  const { t } = useTranslation();
  const { slug, roleId } = useParams<{ slug: string; roleId?: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const publicQuery = usePublicCastingDetails({ slug: slug!, roleId: roleId! });

  if (publicQuery.isLoading || !publicQuery.data) {
    return (
      <Label className="w-full pt-10 flex items-center justify-center text-center text-[var(--color-secondary-grey-fonts)]">
        {t('state.loading')}
      </Label>
    );
  }
  if (publicQuery.error) return <ServerError />;

  const casting = publicQuery.data.casting;
  const alreadyApplied = Boolean(publicQuery.data.alreadyApplied);
  const selectedRole = (casting.roles ?? []).find((role) => role.id === roleId) ?? null;
  const requirements: CastingRequirement[] = toRequirements(selectedRole);
  const employerInfo = casting.employerInfo;

  const right = (
    <>
      {employerInfo && <EmployerInfoSection data={employerInfo} />}
      <ApplySection
        employer={employerInfo?.companyName ?? ''}
        requirements={requirements}
        roleId={roleId!}
        alreadyApplied={alreadyApplied}
      />
    </>
  );

  if (isDesktop) {
    return (
      <main className="flex flex-row gap-10">
        <section className="flex-1">
          <BasicInfoSection data={casting} />
          <Separator className="opacity-0 my-2" />
          <RolesSection data={casting.roles ?? []} />
        </section>
        <section className="flex flex-col gap-6 w-[350px]">{right}</section>
      </main>
    );
  }

  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-3">
      <BasicInfoSection data={casting} />
      <Separator className="opacity-0 my-1" />
      <RolesSection data={casting.roles ?? []} />
      <Separator className="opacity-20 my-4" />
      {right}
    </div>
  );
};

const toRequirements = (role: CastingRole | null): CastingRequirement[] => {
  if (!role?.id) return [];
  if (!role.requiresAudio && !role.requiresVideo) return [];

  return [
    {
      id: role.id,
      roleId: role.id,
      description: role.requirementDescription ?? '',
      requiresAudio: role.requiresAudio,
      requiresVideo: role.requiresVideo,
    },
  ];
};

export default CastingDetailsPage;
