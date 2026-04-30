import { Icon, SectionCard, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../../../shared/lib/routes';
import { InlineList } from '../../../../../shared/components/InlineList';
import StatusDropdown from '../../../../sitemetadata/component/StatusDropdown';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { CASTING_APPLICATION_STATUS_ORDER } from '../../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingApplicationStatusActions } from '../../hooks/status/useCastingApplicationStatusActions';
import type { EmployerCastingApplicantCardResponse } from '../../types/employerCastingApplicants.types';

type Props = {
  data: EmployerCastingApplicantCardResponse;
  isDesktop: boolean;
  onOpenDetails: (talentPublicSlug: string) => void | Promise<void>;
};

const CastingApplicantCard = ({ data, isDesktop, onOpenDetails }: Props) => {
  const { t } = useTranslation();
  const { setStatus, isPending } = useCastingApplicationStatusActions();

  const {
    applicationId,
    talentHeadshotImageUrl,
    talentStageName,
    talentEmail,
    talentPublicSlug,
    talentProfessions,
    castingRoleName,
    castingSlug,
    applicationStatus,
    requirementSubmissions,
  } = data;

  const applicationStatusOptions = useCachedSiteMetadataOption('castingApplicationStatusOptions', t, undefined, {
    raw: true,
  });

  const isMetadataReady = Array.isArray(applicationStatusOptions) && applicationStatusOptions.length > 0;

  const handleSelectApplicationStatus = async (nextStatus: {
    id: string;
    stringCode: string;
    categoryStringCode?: string;
  }) => {
    if (isPending) return;
    await setStatus(nextStatus, { applicationId, castingSlug });
  };

  const handleOpenDetails = () => {
    if (isDesktop) {
      onOpenDetails(talentPublicSlug);
      return;
    }

    window.location.href = ROUTES.PUBLIC_PROFILE + '/' + talentPublicSlug;
  };

  return (
    <SectionCard className="md:w-[415px]">
      {/* Profile and Status */}
      <div className="flex flex-row items-center gap-3 min-w-0">
        <img src={talentHeadshotImageUrl} alt={talentStageName} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-row items-center justify-between gap-3 min-w-0">
            <h2
              className="font-semibold text-base line-clamp-1 cursor-pointer hover:underline hover:text-[var(--color-primary-purple)]"
              onClick={handleOpenDetails}
            >
              {talentStageName}
            </h2>
            <div className="flex flex-row items-center gap-2 shrink-0">
              <a
                key="email"
                href={`mailto:${talentEmail}`}
                aria-label={t('profile.share.email')}
                title="Email"
                className="inline-flex"
              >
                <Icon name="mail" variant="default" />
              </a>
              <Icon name="view" variant="default" onClick={handleOpenDetails} />
            </div>
          </div>
          <InlineList items={talentProfessions} />
        </div>
      </div>

      <Separator className="opacity-20 my-3" />

      {/* Application Status */}
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-(--color-secondary-gray)">{t('general.status')}:</p>
        {isMetadataReady ? (
          <StatusDropdown
            value={applicationStatus}
            allOptions={applicationStatusOptions}
            onSelect={handleSelectApplicationStatus}
            order={CASTING_APPLICATION_STATUS_ORDER}
            disabled={isPending}
            menuClassName="!min-w-[200px]"
          />
        ) : (
          <div className="h-9 w-32 rounded-md bg-[rgba(0,0,0,0.06)] animate-pulse" />
        )}
      </div>

      <Separator className="opacity-20 my-3" />

      {/* Role */}
      <div className="flex flex-row items-center justify-between min-h-[28px]">
        <p className="text-sm text-(--color-secondary-gray)">{t('casting.role_section.role.role')}:</p>
        <p className="text-sm text-black">{castingRoleName}</p>
      </div>

      <Separator className="opacity-20 my-3" />

      {/* Requirements */}
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-(--color-secondary-gray)">
          {t('employer_casting_applicants.applicant_card.actings')}:
        </p>

        {requirementSubmissions.length === 0 ? (
          <span className="rounded-full py-2 px-4 flex items-center gap-1">
            <p className="text-xs font-semibold text-(--color-primary-purple)">-</p>
          </span>
        ) : (
          requirementSubmissions.map((requirement) => (
            <div key={requirement.castingRequirementId} className="flex flex-row items-center gap-2 cursor-pointer">
              {requirement.requiresAudio && (
                <a
                  href={requirement.audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full py-2 px-4 flex items-center gap-1 bg-(--color-primary-light-grey)"
                >
                  <Icon name="play" variant="primary" size={14} />
                  <p className="text-xs font-semibold text-(--color-primary-purple)">
                    {t('employer_casting_applicants.applicant_card.audio')}
                  </p>
                </a>
              )}

              {requirement.requiresVideo && (
                <a
                  href={requirement.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full py-2 px-4 flex items-center gap-1 bg-(--color-primary-light-grey)"
                >
                  <Icon name="play" variant="primary" size={14} />
                  <p className="text-xs font-semibold text-(--color-primary-purple)">
                    {t('employer_casting_applicants.applicant_card.video')}
                  </p>
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default CastingApplicantCard;
