import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { InlineList } from '../../../../shared/components/InlineList';
import { SectionCard } from '../../../../shared/components/Section';
import StatusDropdown from '../../../sitemetadata/component/StatusDropdown';
import { useCachedSiteMetadataOption } from '../../../sitemetadata/hooks/useCachedSiteMetadata';
import { CASTING_APPLICATION_STATUS_ORDER } from '../../../sitemetadata/utils/siteMetadataUtils';
import { useCastingApplicationStatusActions } from '../hooks/status/useCastingApplicationStatusActions';
import type { EmployerCastingApplicantCardResponse } from '../types/employerCastingApplicants.types';

const CastingApplicantCard = ({ data }: { data: EmployerCastingApplicantCardResponse }) => {
  const { t } = useTranslation();
  const { setStatus, isPending } = useCastingApplicationStatusActions();

  const {
    applicationId,
    talentHeadshotImageUrl,
    talentStageName,
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

  return (
    <SectionCard className="lg:min-w-[415px]">
      {/* Profile and Status */}
      <div className="flex flex-row items-center gap-3 min-w-0">
        <img src={talentHeadshotImageUrl} alt={talentStageName} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex flex-col min-w-0">
          <h2 className="font-semibold text-base line-clamp-1">{talentStageName}</h2>
          <InlineList items={talentProfessions} />
        </div>
      </div>

      <Separator className="opacity-20 my-3" />

      {/* Application Status */}
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-[var(--color-secondary-gray)]">{t('general.status')}:</p>
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
        <p className="text-sm text-[var(--color-secondary-gray)]">{t('casting.role_section.role.role')}:</p>
        <p className="text-sm text-black">{castingRoleName}</p>
      </div>

      <Separator className="opacity-20 my-3" />

      {/* Requirements */}
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-[var(--color-secondary-gray)]">
          {t('employer_casting_applicants.applicant_card.actings')}:
        </p>

        {requirementSubmissions.length === 0 ? (
          <span className="rounded-full py-2 px-4 flex items-center gap-1">
            <p className="text-xs font-semibold text-[var(--color-primary-purple)]">-</p>
          </span>
        ) : (
          requirementSubmissions.map((requirement) => (
            <div key={requirement.castingRequirementId} className="flex flex-row items-center gap-2 cursor-pointer">
              {requirement.requiresAudio && (
                <a
                  href={requirement.audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full py-2 px-4 flex items-center gap-1 bg-[var(--color-primary-light-grey)]"
                >
                  <Icon name="play" variant="primary" size={14} />
                  <p className="text-xs font-semibold text-[var(--color-primary-purple)]">
                    {t('employer_casting_applicants.applicant_card.audio')}
                  </p>
                </a>
              )}

              {requirement.requiresVideo && (
                <a
                  href={requirement.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full py-2 px-4 flex items-center gap-1 bg-[var(--color-primary-light-grey)]"
                >
                  <Icon name="play" variant="primary" size={14} />
                  <p className="text-xs font-semibold text-[var(--color-primary-purple)]">
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
