import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { InlineList } from '../../../../shared/components/InlineList';
import { SectionCard } from '../../../../shared/components/Section';
import type { EmployerCastingApplicantCardResponse } from '../types/employerCastingApplicants.types';

const CastingApplicantCard = ({ data }: { data: EmployerCastingApplicantCardResponse }) => {
  const { t } = useTranslation();
  const {
    applicationId,
    talentPublicSlug,
    talentHeadshotImageUrl,
    talentStageName,
    talentProfessions,
    castingRoleName,
    talentEmail,
    talentPhoneNumber,
    castingTitle,
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
            <InlineList items={talentProfessions} />
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
      <Separator className="opacity-20 my-3" />
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-[var(--color-secondary-gray)]">
          {t('employer_casting_applicants.applicant_card.actings')}:
        </p>
        {requirementSubmissions.length === 0 ? (
          <span className="rounded-full py-2 px-4 flex items-center gap-1">
            <p className="text-xs font-semibold text-[var(--color-primary-purple)]">-</p>
          </span>
        ) : (
          requirementSubmissions.map((requirement) => {
            return (
              <div className="flex flex-row items-center gap-2 cursor-pointer">
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
          })
        )}
      </div>
    </SectionCard>
  );
};

export default CastingApplicantCard;
