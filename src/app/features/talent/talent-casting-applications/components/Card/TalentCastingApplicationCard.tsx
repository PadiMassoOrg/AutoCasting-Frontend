import { TagChip, Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { CastingStatusChip } from '../../../../../shared/components/Chip';
import { SectionCard } from '../../../../../shared/components/Section';
import { formatCastingModalityText, formatLocalDate } from '../../../../../shared/utils/formatUtils';
import { normalizeCastingStatusForDisplay } from '../../../../sitemetadata/utils/siteMetadataUtils';
import type { TalentCastingApplicationCardResponse } from '../../types/talentCastingApplication.types';

const TalentCastingApplicationCard = ({ data }: { data: TalentCastingApplicationCardResponse }) => {
  const { t } = useTranslation();

  const {
    roleName,
    castingProjectType,
    castingModality,
    castingStatus,
    employerImageUrl,
    companyName,
    castingModalityText,
    shootingStartDate,
    shootingEndDate,
    gender,
    roleType,
  } = data;

  const displayCastingStatus = normalizeCastingStatusForDisplay(castingStatus);

  return (
    <SectionCard className="lg:min-w-[415px]">
      <div className="flex flex-col gap-2">
        {/* Title and Status */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{roleName}</h2>
          <CastingStatusChip status={displayCastingStatus!}></CastingStatusChip>
        </div>
        {/* Employer */}
        <div className="flex flex-row items-center gap-2">
          <img src={employerImageUrl} alt="employer Image" className="w-6 h-6 rounded-full object-cover" />
          <p className="text-xs font-light text-[var(--color-secondary-gray)]">{companyName}</p>
        </div>
        {/* Project Type and Modality */}
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <TagChip label={t(castingProjectType.stringCode)}></TagChip>
          <TagChip label={formatCastingModalityText(castingModality.stringCode, t)}></TagChip>
        </div>
        {/* Location and Dates */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <Icon name="location" />
            {castingModalityText ? (
              <p className="text-sm text-[var(--color-secondary-gray)]">{castingModalityText}</p>
            ) : (
              <p className="text-sm text-[var(--color-secondary-gray)]">-</p>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            <Icon name="calendar"></Icon>
            <p className="text-sm text-[var(--color-secondary-gray)]">
              {shootingStartDate && shootingEndDate
                ? `${formatLocalDate(shootingStartDate, 'dayMonth')} - ${formatLocalDate(shootingEndDate, 'dayMonth')}`
                : ''}
            </p>
          </div>
        </div>
        {/* Role */}
        <div className="flex flex-row gap-2">
          <TagChip label={t(roleType.stringCode)}></TagChip>
          <TagChip label={t(gender.stringCode)}></TagChip>
        </div>
      </div>
    </SectionCard>
  );
};

export default TalentCastingApplicationCard;
