import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionCard } from '../../../../shared/components/Section';
import type { EmployerCastingApplicantCardResponse } from '../types/employerCastingApplicants.types';

const CastingApplicantCard = ({ data }: { data: EmployerCastingApplicantCardResponse }) => {
  const { t } = useTranslation();
  const {
    applicationId,
    talentProfileId,
    talentHeadshotImageUrl,
    talentStageName,
    talentProfessions,
    castingRoleName,
    castingRoleId,
    castingSlug,
    applicationStatus,
    requirementSubmissions,
  } = data;

  return (
    <SectionCard className="lg:min-w-[415px]">
      {/* Profile and Status */}
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <img src={talentHeadshotImageUrl} alt={talentStageName} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <h2 className="font-semibold text-base">{talentStageName}</h2>
            <p className="text-sm text-[var(--color-secondary-gray)]">
              {talentProfessions.map((p) => t(p.stringCode)).join(', ')}
            </p>
          </div>
        </div>
      </div>
      <Separator className="opacity-20 my-3" />
      {/* Role */}
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-[var(--color-secondary-gray)]">{t('casting.role_section.role.role')}:</p>
        <p className="text-sm text-black">{castingRoleName}</p>
      </div>

      {/* Requirements */}
      {requirementSubmissions.length > 0 && (
        <>
          <Separator className="opacity-20 my-3" />
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-[var(--color-secondary-gray)]">
              {t('employer_casting_applicants.applicant_card.actings')}:
            </p>
            {requirementSubmissions.map((requirement) => {
              return (
                <div className="flex flex-row items-center gap-2">
                  {requirement.requiresAudio && (
                    <a
                      href={requirement.audioUrl}
                      target="_blank"
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
                      href={requirement.audioUrl}
                      target="_blank"
                      className="rounded-full py-2 px-4 flex items-center gap-1 bg-[var(--color-primary-light-grey)]"
                    >
                      <Icon name="play" variant="primary" size={14} />
                      <p className="text-xs font-semibold text-[var(--color-primary-purple)]">
                        {t('employer_casting_applicants.applicant_card.video')}
                      </p>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </SectionCard>
  );
};

export default CastingApplicantCard;
