import { TagChip, Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { CastingBasicInfoSection } from '../../types/publicCasting.types';

const BasicInfoSection = ({ data }: { data: CastingBasicInfoSection }) => {
  const { t } = useTranslation();

  const deadlineText = `${t('casting.basic_info.deadline_complete')} ${data.applicationDeadline}`;
  const shootingText = `${data.shootingStartDate} - ${data.shootingEndDate}`;

  return (
    <section className="flex flex-col gap-4">
      {/* Title, Project type, Modality */}
      <article className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">{data.title}</h2>
          {/* TODO: Ver el NEW state */}
          <span></span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <TagChip label={t(data.projectType!.stringCode!)} />
          <TagChip label={t(data.castingModality!.stringCode!)} />
        </div>
      </article>
      {/* Location, Deadline, Shooting */}
      <article className="flex flex-col gap-2 text-sm text-[var(--color-secondary-grey-fonts)]">
        {data.castingModalityText && (
          <span className="flex flex-row gap-2 items-center">
            <Icon name="location" className="opacity-30" />
            <p>{data.castingModalityText}</p>
          </span>
        )}
        <span className="flex flex-row gap-2 items-center">
          <Icon name="clock" className="opacity-30" />
          <p>{deadlineText}</p>
        </span>
        <span className="flex flex-row gap-2 items-center">
          <Icon name="calendar" className="opacity-30" />
          <p>{shootingText}</p>
        </span>
      </article>
      {/* Description */}
      <p className="text-sm text-[var(--color-secondary-grey-fonts)] font-light">{data.description}</p>
    </section>
  );
};

export default BasicInfoSection;
