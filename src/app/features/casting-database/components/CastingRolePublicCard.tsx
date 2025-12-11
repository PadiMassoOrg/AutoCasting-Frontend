import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from '../../../shared/components/Chevron';
import { Chip } from '../../../shared/components/Chip/Chip';
import { Icon } from '../../../shared/components/Icon/Icon';
import { LG_SCREEN_SIZE, useMedia } from '../../../shared/hooks/useMedia';
import type { CastingRolePublicCardResponse } from '../types/casting-database.types';

type Props = {
  item: CastingRolePublicCardResponse;
  onClick?: () => void;
};

const CastingRolePublicCard = ({ item, onClick }: Props) => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const {
    id,
    name,
    employerImageUrl,
    employerCompanyName,
    projectType,
    castingModality,
    location,
    shootingStartDate,
    shootingEndDate,
    professions,
    roleType,
    gender,
    ageMin,
    ageMax,
    defaultCode,
  } = item;

  const getAgeChip = () => {
    const string = ageMin + ' - ' + ageMax + t('general.years');
    return string;
  };

  if (!isDesktop) {
    return (
      <article
        className="
        w-full
        rounded-xl border border-[var(--color-secondary-outline)] bg-white p-4
        flex flex-col gap-3
      "
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
            <span>NUEVO</span>
          </div>

          <div className="flex flex-row gap-1 items-center">
            <img src={employerImageUrl} className="w-6 h-6 rounded-full object-cover"></img>
            <p className="text-[var(--color-secondary-grey-fonts)] text-sm font-light">{employerCompanyName}</p>
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Chip label={projectType.stringCode} t={t} />
          <Chip label={castingModality.stringCode} t={t} />
        </div>

        <div className="flex flex-col gap-2 items-start">
          <div className="flex flex-row gap-2 items-center">
            <Icon name="location" className="opacity-40" size={20} />
            <p className="text-[var(--color-secondary-grey-fonts)] text-base font-light">{t(location)}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Icon name="calendar" className="opacity-40" size={20} />
            <p className="text-[var(--color-secondary-grey-fonts)] text-base font-light">
              {shootingStartDate} - {shootingEndDate}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {professions.slice(-3).map((p) => {
            return <Chip label={p.stringCode} t={t} key={p.id} />;
          })}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Chip label={roleType.stringCode} t={t} />
          <Chip label={gender.stringCode} t={t} />
          <Chip label={getAgeChip()} t={t} />
        </div>
        <Separator className="opacity-20 my-2"></Separator>
        <Button variant="primary">
          {t('buttons.view_details')}
          <ChevronRight />
        </Button>
      </article>
    );
  }
  if (isDesktop) {
    return (
      <article
        className="
        w-full
        rounded-xl border border-[var(--color-secondary-outline)] bg-white p-4
        flex flex-col gap-4
      "
      >
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold">{name}</h2>
          <div className="text-nowrap flex flex-row gap-2 items-center">
            <Chip label={projectType.stringCode} t={t} />
            <Chip label={castingModality.stringCode} t={t} />
            <Button variant="primary">
              {t('buttons.view_details')}
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <img src={employerImageUrl} className="w-6 h-6 rounded-full object-cover"></img>
          <p className="text-[var(--color-secondary-grey-fonts)] text-sm font-light">{employerCompanyName}</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            {professions.slice(-3).map((p) => {
              return <Chip label={p.stringCode} t={t} key={p.id} />;
            })}
            <Chip label={roleType.stringCode} t={t} />
            <Chip label={gender.stringCode} t={t} />
            <Chip label={getAgeChip()} t={t} />
          </div>
          <div className="flex flex-row gap-6 items-center">
            <div className="flex flex-row gap-2 items-center">
              <Icon name="location" className="opacity-40" size={20} />
              <p className="text-[var(--color-secondary-grey-fonts)] text-base font-light">{t(location)}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon name="calendar" className="opacity-40" size={20} />
              <p className="text-[var(--color-secondary-grey-fonts)] text-base font-light">
                {shootingStartDate} - {shootingEndDate}
              </p>
            </div>
          </div>
        </div>
      </article>
    );
  }
};

export default CastingRolePublicCard;
