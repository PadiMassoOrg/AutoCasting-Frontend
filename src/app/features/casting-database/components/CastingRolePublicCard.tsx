import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from '../../../shared/components/Chevron';
import { Chip } from '../../../shared/components/Chip/Chip';
import { useMedia, XL_SCREEN_SIZE } from '../../../shared/hooks/useMedia';
import { ROUTES } from '../../../shared/lib/routes';
import type { CastingRolePublicCardResponse } from '../types/casting-database.types';

type Props = {
  item: CastingRolePublicCardResponse;
};

const CastingRolePublicCard = ({ item }: Props) => {
  const { t } = useTranslation();
  const isDesktop = useMedia(XL_SCREEN_SIZE);
  const {
    name,
    employerImageUrl,
    employerCompanyName,
    projectType,
    castingModality,
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
      <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>

          <div className="flex flex-row gap-1 items-center">
            <img src={employerImageUrl} className="w-6 h-6 rounded-full object-cover"></img>
            <p className="text-[var(--color-secondary-grey-fonts)] text-sm font-light">{employerCompanyName}</p>
          </div>
        </div>

        <div className="flex flex-row gap-1 items-center">
          <Chip label={projectType.stringCode} t={t} />
          <Chip label={castingModality.stringCode} t={t} />
        </div>
        <div className="flex flex-row gap-1 items-center flex-wrap">
          {professions.slice(-3).map((p) => {
            return <Chip label={p.stringCode} t={t} key={p.id} />;
          })}
          <Chip label={roleType.stringCode} t={t} />
          <Chip label={gender.stringCode} t={t} />
          <Chip label={getAgeChip()} t={t} />
        </div>
        <Separator className="opacity-20"></Separator>
        <Button asChild variant="primary" className="max-w-[180px]">
          <Link to={`${ROUTES.PUBLIC_CASTING}/${defaultCode}`}>
            {t('buttons.view_details')}
            <ChevronRight />
          </Link>
        </Button>
      </article>
    );
  }
  if (isDesktop) {
    return (
      <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-10 flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{name}</h2>
            <div className="flex flex-row gap-2 items-center">
              <img src={employerImageUrl} className="w-6 h-6 rounded-full object-cover"></img>
              <p className="text-[var(--color-secondary-grey-fonts)] text-sm font-light">{employerCompanyName}</p>
            </div>
          </div>
          <div className="text-nowrap flex flex-row gap-1 items-center">
            <Chip label={projectType.stringCode} t={t} />
            <Chip label={castingModality.stringCode} t={t} />
          </div>
        </div>
        <div className="flex flex-row items-end justify-between">
          <div className="flex flex-row gap-1 items-center">
            {professions.slice(-3).map((p) => {
              return <Chip label={p.stringCode} t={t} key={p.id} />;
            })}
            <Chip label={roleType.stringCode} t={t} />
            <Chip label={gender.stringCode} t={t} />
            <Chip label={getAgeChip()} t={t} />
          </div>
          <Button asChild variant="primary" className="max-w-[180px]">
            <Link to={`${ROUTES.PUBLIC_CASTING}/${defaultCode}`}>
              {t('buttons.view_details')}
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </article>
    );
  }
};

export default CastingRolePublicCard;
