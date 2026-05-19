import { Icon, SectionCard, Separator, TagChip } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ProjectTypeTagChip } from '../../../shared/components/Chip';
import { formatAgeRange, formatLocalDate } from '../../../shared/utils/formatUtils';
import { GENDER_INDISTINCT } from '../../sitemetadata/utils/siteMetadataUtils';
import type { CastingRolePublicCardResponse } from '../types/casting-database.types';

type Props = {
  item: CastingRolePublicCardResponse;
  selected?: boolean;
  onSelect?: (item: CastingRolePublicCardResponse) => void;
};

const CastingRolePublicCard = ({ item, selected = false, onSelect }: Props) => {
  const { t } = useTranslation();

  const {
    name,
    castingTitle,
    employerImageUrl,
    projectType,
    shootingStartDate,
    shootingEndDate,
    roleType,
    gender,
    ageMin,
    ageMax,
  } = item;

  const genderRenderer = (stringcode: string) => {
    return (
      <TagChip
        label={stringcode === GENDER_INDISTINCT ? t('profile.basic_info.gender') + ': ' + t(stringcode) : t(stringcode)}
      />
    );
  };

  const cardClassName = ['cursor-pointer', selected && '!border-(--color-primary-purple)'].filter(Boolean).join(' ');

  const handleSelect = () => onSelect?.(item);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!onSelect) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelect(item);
  };

  return (
    <SectionCard
      className={cardClassName}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? selected : undefined}
    >
      <div className="w-full flex flex-col">
        {/* Upper Section */}
        <article className="flex w-full items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <img src={employerImageUrl} className="h-10 w-10 shrink-0 rounded-full object-cover"></img>
            <div className="min-w-0 flex flex-1 flex-col">
              <h2 className="truncate text-base font-semibold">{name}</h2>
              <p className="truncate text-xs font-light text-(--color-secondary-grey-fonts)">{castingTitle}</p>
            </div>
          </div>
          <ProjectTypeTagChip projectType={projectType} />
        </article>

        <Separator className="opacity-20 my-3"></Separator>

        {/* Bottom Section */}
        <article className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <Icon name="calendar" variant="default" />
            <p className="text-sm">{`${formatLocalDate(shootingStartDate, 'numeric')} - ${formatLocalDate(
              shootingEndDate,
              'numeric'
            )}`}</p>
          </div>
          <div className="flex flex-row gap-1 items-center flex-wrap">
            {genderRenderer(gender.stringCode)}
            <TagChip label={t(roleType.stringCode)} />
            <TagChip label={formatAgeRange(ageMin, ageMax, t)} />
          </div>
        </article>
      </div>
    </SectionCard>
  );
};

export default CastingRolePublicCard;
