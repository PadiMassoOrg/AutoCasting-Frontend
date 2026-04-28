import { Button, ChevronRight, TagChip, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMedia, XL_SCREEN_SIZE } from '../../../shared/hooks/useMedia';
import { ROUTES } from '../../../shared/lib/routes';
import { formatAgeRange } from '../../../shared/utils/formatUtils';
import { GENDER_INDISTINCT } from '../../sitemetadata/utils/siteMetadataUtils';
import type { CastingRolePublicCardResponse } from '../types/casting-database.types';

type Props = {
  item: CastingRolePublicCardResponse;
};

const CastingRolePublicCard = ({ item }: Props) => {
  const { t } = useTranslation();
  const isDesktop = useMedia(XL_SCREEN_SIZE);

  const {
    id,
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

  const genderRenderer = (stringcode: string) => {
    return (
      <TagChip
        label={stringcode === GENDER_INDISTINCT ? t('profile.basic_info.gender') + ': ' + t(stringcode) : t(stringcode)}
      />
    );
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
          <TagChip label={t(projectType.stringCode)} />
          <TagChip label={t(castingModality.stringCode)} />
        </div>
        <div className="flex flex-row gap-1 items-center flex-wrap">
          {professions.slice(-3).map((p) => {
            return <TagChip label={t(p.stringCode)} key={p.id} />;
          })}

          <TagChip label={t(roleType.stringCode)} />
          {genderRenderer(gender.stringCode)}
          <TagChip label={formatAgeRange(ageMin, ageMax, t)} />
        </div>
        <Separator className="opacity-20"></Separator>
        <Button asChild variant="primary">
          <Link to={`${ROUTES.PUBLIC_CASTING}/${defaultCode}/roles/${id}`}>
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
            <TagChip label={t(projectType.stringCode)} />
            <TagChip label={t(castingModality.stringCode)} />
          </div>
        </div>
        <div className="flex flex-row items-end justify-between">
          <div className="flex flex-row gap-1 items-center">
            {professions.slice(-3).map((p) => {
              return <TagChip label={t(p.stringCode)} key={p.id} />;
            })}
            <TagChip label={t(roleType.stringCode)} />
            {genderRenderer(gender.stringCode)}
            <TagChip label={formatAgeRange(ageMin, ageMax, t)} />
          </div>
          <Button asChild variant="primary" className="max-w-[180px]">
            <Link to={`${ROUTES.PUBLIC_CASTING}/${defaultCode}/roles/${id}`}>
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
