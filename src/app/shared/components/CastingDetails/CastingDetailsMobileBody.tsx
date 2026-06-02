import { Icon, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PublicCastingData } from '../../../features/public-casting/types/publicCasting.types';
import { formatLocalDate } from '../../utils/formatUtils';
import { CastingModalityTagChip, ProjectTypeTagChip } from '../Chip';
import {
  buildCharacteristicTags,
  buildRoleTags,
  buildSkillTags,
  CastingDetailsCompensation,
  CastingDetailsEmployerCard,
  DetailTagSection,
} from './CastingDetailsDesktopBody';
import ExpandableText from '../ExpandableText/ExpandableText';

type Props = {
  casting: PublicCastingData;
};

const CastingDetailsMobileBody = ({ casting }: Props) => {
  const { t } = useTranslation();
  const {
    title,
    projectType,
    castingModality,
    locationText,
    applicationDeadline,
    wardrobeFittingText,
    shootingEndDate,
    shootingStartDate,
    description,
    roles,
  } = casting;

  const role = roles[0] ?? null;
  const roleTags = useMemo(() => buildRoleTags(role, t), [role, t]);
  const characteristicTags = useMemo(() => buildCharacteristicTags(role, t), [role, t]);
  const skillTags = useMemo(() => buildSkillTags(role, t), [role, t]);

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold leading-tight">{role?.roleName}</h1>
        <p className="text-sm font-light text-(--color-secondary-grey-fonts)">{title}</p>
      </section>

      <Separator className="opacity-20 my-1" />

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <ProjectTypeTagChip projectType={projectType} />
          <CastingModalityTagChip castingModality={castingModality} />
        </div>

        <span className="flex items-center gap-1">
          <Icon name="clock" className="opacity-30" />
          <p className="text-sm font-light text-[var(--color-secondary-grey-fonts)]">{`${t('casting.basic_info.deadline_complete')} ${formatLocalDate(applicationDeadline, 'long')}`}</p>
        </span>

        <span className="flex items-center gap-1">
          <Icon name="calendar" />
          <p className="text-sm">{`${formatLocalDate(shootingStartDate, 'long')} - ${formatLocalDate(shootingEndDate, 'long')}`}</p>
        </span>

        {(description || locationText || wardrobeFittingText) && (
          <>
            <Separator className="opacity-0" />
            <article className="flex flex-col gap-4">
              {description && (
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold">{t('casting-database.detail.project_description')}</h3>
                  <ExpandableText text={description} />
                </div>
              )}
              {locationText && (
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold">{t('casting-database.detail.casting_modality_on_site')}</h3>
                  <p>{locationText}</p>
                </div>
              )}
              {wardrobeFittingText && (
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold">{t('casting-database.detail.casting_wardrobe_fitting')}</h3>
                  <p>{wardrobeFittingText}</p>
                </div>
              )}
            </article>
          </>
        )}
      </section>

      <Separator className="opacity-20 my-1" />

      <section className="flex flex-col gap-6">
        {roleTags.length > 0 && (
          <DetailTagSection title={t('casting-database.detail.role_basic_info')} tags={roleTags} />
        )}
        {characteristicTags.length > 0 && (
          <DetailTagSection title={t('casting-database.detail.role_characteristics')} tags={characteristicTags} />
        )}
        {skillTags.length > 0 && <DetailTagSection title={t('casting-database.detail.role_skills')} tags={skillTags} />}
      </section>

      <Separator className="opacity-20" />

      <section className="flex flex-col gap-4">
        <CastingDetailsCompensation role={role} />
        <CastingDetailsEmployerCard employerInfo={casting.employerInfo} />
      </section>
    </div>
  );
};

export default CastingDetailsMobileBody;
