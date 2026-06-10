import { Icon, LG_SCREEN_SIZE, SectionCard, Separator, TagChip, useMedia } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  PublicCastingData,
  PublicCastingEmployerInfo,
  PublicCastingRole,
} from '../../../features/public-casting/types/publicCasting.types';
import { GENDER_INDISTINCT } from '../../../features/sitemetadata/utils/siteMetadataUtils';
import { getSocialMediaIconName } from '../../../features/talent/talent-profile-edit/components/Form/SocialMedia/SocialMediaIconMapper';
import {
  formatAgeRange,
  formatBooleanLabeled,
  formatCurrencyAmount,
  formatLocalDate,
  formatMemberSince,
  normalizeExternalUrl,
} from '../../utils/formatUtils';
import { CastingModalityTagChip, ProjectTypeTagChip } from '../Chip';
import ExpandableText from '../ExpandableText/ExpandableText';

type Props = {
  casting: PublicCastingData;
};

const CastingDetailsDesktopBody = ({ casting }: Props) => {
  const { t } = useTranslation();
  const {
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
    <>
      <section className="flex flex-col gap-10">
        <article className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <span className="flex flex-row gap-2 items-center">
              <ProjectTypeTagChip projectType={projectType} />
              <CastingModalityTagChip castingModality={castingModality} />
            </span>
            <span className="flex items-center gap-2">
              <Icon name="clock" className="opacity-30" />
              <p className="text-sm font-light text-[var(--color-secondary-grey-fonts)]">{`${t('casting.basic_info.deadline_complete')} ${formatLocalDate(applicationDeadline, 'long')}`}</p>
            </span>
          </div>
          <span className="flex items-center gap-2">
            <Icon name="calendar" />
            <p className="text-sm">{`${formatLocalDate(shootingStartDate, 'long')} - ${formatLocalDate(shootingEndDate, 'long')}`}</p>
          </span>
        </article>

        {(description || locationText || wardrobeFittingText) && (
          <article className="flex flex-col gap-8">
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
        )}
      </section>

      <Separator className="opacity-20 my-6" />

      <section className="flex flex-col gap-6">
        {roleTags.length > 0 && (
          <DetailTagSection title={t('casting-database.detail.role_basic_info')} tags={roleTags} />
        )}
        {characteristicTags.length > 0 && (
          <DetailTagSection title={t('casting-database.detail.role_characteristics')} tags={characteristicTags} />
        )}
        {skillTags.length > 0 && <DetailTagSection title={t('casting-database.detail.role_skills')} tags={skillTags} />}
      </section>

      <Separator className="opacity-20 my-6" />

      <section className="flex flex-col gap-6">
        <CastingDetailsCompensation role={role} />
        <CastingDetailsEmployerCard employerInfo={casting.employerInfo} />
      </section>
    </>
  );
};

export const DetailTagSection = ({ title, tags }: { title: string; tags: Array<{ key: string; label: string }> }) => {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold">{`${title}:`}</h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagChip key={tag.key} label={tag.label} />
        ))}
      </div>
    </div>
  );
};

export const CastingDetailsCompensation = ({ role }: { role: PublicCastingRole | null }) => {
  const { t } = useTranslation();

  const amountLabel = formatCurrencyAmount(
    role?.remuneration?.amount ?? null,
    role?.remuneration?.currency?.stringCode ?? null
  );
  const payRateLabelKey = role?.remuneration?.payRateType?.stringCode;
  const payRateLabel = payRateLabelKey ? t(payRateLabelKey) : '';
  const finalAmountAndCurrencyLabel =
    amountLabel && payRateLabel ? `${amountLabel} (${payRateLabel})` : amountLabel || payRateLabel || '';

  return (
    <article className="self-end flex flex-row flex-wrap items-center gap-2 text-base font-semibold">
      <h2>{t('casting-database.detail.role_remuneration_title')}:</h2>
      <span>{finalAmountAndCurrencyLabel}</span>
    </article>
  );
};

export const CastingDetailsEmployerCard = ({ employerInfo }: { employerInfo: PublicCastingEmployerInfo }) => {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const socialMediaItems =
    employerInfo.socialMedia?.links
      ?.filter((link: { url: string }) => !!link.url && link.url.trim().length > 0)
      .map((link: { optionId: string; stringCode: string; url: string }) => {
        const href = normalizeExternalUrl(link.url);
        if (!href) return null;

        const iconName = getSocialMediaIconName(link.stringCode);
        if (!iconName) return null;

        return (
          <a key={link.optionId} href={href} target="_blank" rel="noopener noreferrer">
            <Icon name={iconName} variant="default" />
          </a>
        );
      })
      .filter(Boolean) ?? [];

  const websiteUrl = employerInfo.websiteUrl && (
    <a href={employerInfo.websiteUrl} target="_blank" rel="noopener noreferrer">
      <Icon name="web" variant="default" />
    </a>
  );

  const allIcons = (
    <div className="flex flex-row justify-end gap-2 mb-1 flex-wrap">
      {websiteUrl}
      {socialMediaItems}
    </div>
  );

  if (!isDesktop)
    return (
      <SectionCard className="bg-[var(--color-secondary-offwhite)]">
        <article className="flex flex-row items-center gap-1.5">
          <img
            src={employerInfo.imageUrl}
            alt={employerInfo.companyName ?? 'Employer'}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1 flex-wrap">
            <h4 className="text-base font-semibold">{employerInfo.companyName}</h4>
            <span className="flex items-center gap-2">
              {employerInfo.companyType?.stringCode ? <TagChip label={t(employerInfo.companyType.stringCode)} /> : null}
              {allIcons}
            </span>
          </div>
        </article>
        <Separator className="opacity-0 my-2" />
        <article className="flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <Icon name="clapper" size={16} />
            <p className="text-sm font-light">
              {employerInfo.totalCastings} {t('casting-database.page.created_castings')}
            </p>
          </span>
          <span className="flex items-center gap-2">
            <Icon name="profile" size={16} />
            <p className="text-sm font-light">{formatMemberSince(employerInfo.memberSince, t)}</p>
          </span>
        </article>
      </SectionCard>
    );

  if (isDesktop)
    return (
      <SectionCard className="bg-[var(--color-secondary-offwhite)]">
        <article className="flex flex-row items-center gap-2">
          <img
            src={employerInfo.imageUrl}
            alt={employerInfo.companyName ?? 'Employer'}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="w-full flex flex-col gap-1">
            <div className="flex flex-row items-center justify-between">
              <h4 className="text-base font-semibold">{employerInfo.companyName}</h4>
              <span className="flex items-center gap-2">
                <Icon name="clapper" size={16} />
                <p className="text-sm font-light">
                  {employerInfo.totalCastings} {t('casting-database.page.created_castings')}
                </p>
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <span className="flex items-center gap-2">
                {employerInfo.companyType?.stringCode ? (
                  <TagChip label={t(employerInfo.companyType.stringCode)} />
                ) : null}
                {allIcons}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="profile" size={16} />
                <p className="text-sm font-light">{formatMemberSince(employerInfo.memberSince, t)}</p>
              </span>
            </div>
          </div>
        </article>
      </SectionCard>
    );
};

export const buildRoleTags = (role: PublicCastingRole | null, t: (key: string) => string) => {
  if (!role) return [];

  const tags: Array<{ key: string; label: string }> = [];

  role.professions.forEach((profession) => {
    tags.push({ key: profession.id, label: t(profession.stringCode) });
  });

  if (role.roleType?.stringCode) {
    tags.push({ key: `role-type-${role.roleType.id}`, label: t(role.roleType.stringCode) });
  }

  if (role.gender?.stringCode) {
    const genderLabel =
      role.gender?.stringCode === GENDER_INDISTINCT
        ? t('profile.basic_info.gender') + ': ' + t(role.gender?.stringCode)
        : t(role.gender?.stringCode);
    tags.push({ key: `gender-${role.gender.id}`, label: genderLabel });
  }

  if (role.ageMin != null || role.ageMax != null) {
    tags.push({
      key: 'age-range',
      label: formatAgeRange(role.ageMin ?? 0, role.ageMax ?? 0, t),
    });
  }

  return tags;
};

export const buildCharacteristicTags = (role: PublicCastingRole | null, t: (key: string) => string) => {
  if (!role) return [];

  const labels = [
    role.ethnicity?.stringCode ? t(role.ethnicity.stringCode) : null,
    formatBooleanLabeled({ labelKey: 'profile.characteristics.tattoo', value: role.tattoo, t }),
    formatBooleanLabeled({ labelKey: 'profile.characteristics.passport', value: role.passport, t }),
    formatBooleanLabeled({ labelKey: 'profile.characteristics.drivingLicense', value: role.drivingLicense, t }),
  ].filter((value): value is string => Boolean(value));

  return labels.map((label, index) => ({ key: `characteristic-${index}`, label }));
};

export const buildSkillTags = (role: PublicCastingRole | null, t: (key: string) => string) => {
  if (!role) return [];

  return (role.skills ?? []).map((skill) => ({
    key: skill.id,
    label: skill.categoryStringCode ? `${t(skill.categoryStringCode)}: ${t(skill.stringCode)}` : t(skill.stringCode),
  }));
};

export default CastingDetailsDesktopBody;
