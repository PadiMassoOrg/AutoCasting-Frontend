import { Button, Icon, SectionCard, Separator, TagChip } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { USER_MODE_TALENT, useUserMode } from '../../../context/UserModeContext';
import { getAuthToken } from '../../../shared/lib/cookies';
import {
  formatAgeRange,
  formatBooleanLabeled,
  formatCurrencyAmount,
  formatLocalDate,
  formatMemberSince,
} from '../../../shared/utils/formatUtils';
import { GENDER_INDISTINCT } from '../../sitemetadata/utils/siteMetadataUtils';
import type { CastingCatalogDetailsResponse, CastingCatalogRole } from '../types/casting-database.types';

type Props = {
  data: CastingCatalogDetailsResponse;
};

const CastingCatalogDetailsPanel = ({ data }: Props) => {
  const { t } = useTranslation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();
  const casting = data.casting;
  const isApplyEnabled = Boolean(isAuth) && mode === USER_MODE_TALENT && !data.alreadyApplied;

  const {
    employerInfo,
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
  const skillTags = useMemo(
    () =>
      (role?.skills ?? []).map((skill) => ({
        key: skill.id,
        label: skill.categoryStringCode
          ? `${t(skill.categoryStringCode)}: ${t(skill.stringCode)}`
          : t(skill.stringCode),
      })),
    [role?.skills, t]
  );
  const amountLabel = formatCurrencyAmount(
    role?.remuneration?.amount ?? null,
    role?.remuneration?.currency?.stringCode ?? null
  );
  const payRateLabelKey = role?.remuneration?.payRateType?.stringCode;
  const payRateLabel = payRateLabelKey ? t(payRateLabelKey) : '';

  const finalAmountAndCurrencyLabel =
    amountLabel && payRateLabel ? `${amountLabel} (${payRateLabel})` : amountLabel || payRateLabel || '';

  return (
    <>
      {/* Title + Apply */}
      <section className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">{role?.roleName}</h2>
        <Button variant="primary" className="max-w-[230px]" disabled={!isApplyEnabled}>
          {t('general.apply')}
        </Button>
      </section>

      <Separator className="opacity-20 my-6" />

      <section className="flex flex-col gap-10">
        {/* Project Type + Modality + Deadline + Shooting Dates */}
        <article className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <span className="flex flex-row gap-2 items-center">
              <TagChip label={t(projectType.stringCode)} />
              <TagChip label={t(castingModality.stringCode)} />
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

        {/* Description + Texts for Modality and Wardrobe */}
        {(description || locationText || wardrobeFittingText) && (
          <article className="flex flex-col gap-8">
            {description && (
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">{t('casting-database.detail.project_description')}</h3>
                <p className="text-sm">{description}</p>
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

      {/* Talent + Characteristics + Skills */}
      <section className="flex flex-col gap-6">
        {roleTags.length > 0 && (
          <DetailTagSection title={t('casting-database.detail.role_basic_info')} tags={roleTags} />
        )}
        {characteristicTags.length > 0 && <DetailTagSection title="Características" tags={characteristicTags} />}
        {skillTags.length > 0 && <DetailTagSection title="Skills" tags={skillTags} />}
      </section>

      <Separator className="opacity-20 my-6" />

      {/* Remuneration + Employer */}
      <section className="flex flex-col gap-6 text-base font-semibold">
        <article className="self-end flex flex-row items-center gap-2">
          <h2>{t('casting-database.detail.role_remuneration_title')}:</h2>
          <span>{finalAmountAndCurrencyLabel}</span>
        </article>
        <SectionCard className="bg-[var(--color-secondary-offwhite)]">
          <article className="flex flex-row items-center gap-2">
            <img
              src={employerInfo.imageUrl ?? ''}
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
                {employerInfo.companyType?.stringCode ? (
                  <TagChip label={t(employerInfo.companyType.stringCode)} />
                ) : null}
                <span className="flex items-center gap-2">
                  <Icon name="profile" size={16} />
                  <p className="text-sm font-light">{formatMemberSince(employerInfo.memberSince, t)}</p>
                </span>
              </div>
            </div>
          </article>
        </SectionCard>
      </section>
    </>
  );
};

const DetailTagSection = ({ title, tags }: { title: string; tags: Array<{ key: string; label: string }> }) => {
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

const buildRoleTags = (role: CastingCatalogRole | null, t: (key: string) => string) => {
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

const buildCharacteristicTags = (role: CastingCatalogRole | null, t: (key: string) => string) => {
  if (!role) return [];

  const labels = [
    role.ethnicity?.stringCode ? t(role.ethnicity.stringCode) : null,
    formatBooleanLabeled({ labelKey: 'profile.characteristics.tattoo', value: role.tattoo, t }),
    formatBooleanLabeled({ labelKey: 'profile.characteristics.passport', value: role.passport, t }),
    formatBooleanLabeled({ labelKey: 'profile.characteristics.drivingLicense', value: role.drivingLicense, t }),
  ].filter((value): value is string => Boolean(value));

  return labels.map((label, index) => ({ key: `characteristic-${index}`, label }));
};

export default CastingCatalogDetailsPanel;
