import { Icon, Label, SectionCard, Separator, TagChip } from 'autocasting-ui-library-padimasso';
import { LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CastingCatalogDetailsApplyAction } from '../../casting-database/components';
import { GENDER_INDISTINCT } from '../../sitemetadata/utils/siteMetadataUtils';
import { getSocialMediaIconName } from '../../talent/talent-profile-edit/components/Form/SocialMedia/SocialMediaIconMapper';
import { CastingModalityTagChip, ProjectTypeTagChip } from '../../../shared/components/Chip';
import ServerError from '../../../shared/components/ServerError/ServerError';
import {
  formatAgeRange,
  formatBooleanLabeled,
  formatCurrencyAmount,
  formatLocalDate,
  formatMemberSince,
  normalizeExternalUrl,
} from '../../../shared/utils/formatUtils';
import { ApplySection, BasicInfoSection, EmployerInfoSection, RolesSection } from '../components/Section';
import { usePublicCastingDetails } from '../hooks/usePublicCastingDetails';
import type { CastingRequirement, CastingRole, PublicCastingDetailsResponse } from '../types/publicCasting.types';

const CastingDetailsPage = () => {
  const { t } = useTranslation();
  const { slug, roleId } = useParams<{ slug: string; roleId?: string }>();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const publicQuery = usePublicCastingDetails({ slug: slug!, roleId: roleId! });

  if (publicQuery.isLoading || !publicQuery.data) {
    return (
      <Label className="w-full pt-10 flex items-center justify-center text-center text-[var(--color-secondary-grey-fonts)]">
        {t('state.loading')}
      </Label>
    );
  }
  if (publicQuery.error) return <ServerError />;

  const casting = publicQuery.data.casting;
  const alreadyApplied = Boolean(publicQuery.data.alreadyApplied);
  const selectedRole = casting.roles?.[0] ?? null;
  const requirements: CastingRequirement[] = toRequirements(selectedRole);
  const employerInfo = casting.employerInfo;

  const right = (
    <>
      {employerInfo && <EmployerInfoSection data={employerInfo} />}
      <ApplySection
        employer={employerInfo?.companyName ?? ''}
        requirements={requirements}
        roleId={roleId!}
        alreadyApplied={alreadyApplied}
      />
    </>
  );

  if (isDesktop) {
    return (
      <main className="flex flex-col gap-6">
        <section className="flex items-start justify-between">
          <div className="w-full">
            <h2 className="text-3xl font-semibold">{selectedRole?.roleName}</h2>
            <p className="text-base font-light text-(--color-secondary-grey-fonts)">{casting.title}</p>
          </div>
          <CastingCatalogDetailsApplyAction data={publicQuery.data as unknown as never} />
        </section>

        <Separator className="opacity-0 my-2" />

        <CastingDetailsDesktopPanel data={publicQuery.data} />
      </main>
    );
  }

  return (
    <div className="relative pt-3 pb-24 flex flex-col gap-3">
      <BasicInfoSection data={casting} />
      <Separator className="opacity-0 my-1" />
      <RolesSection data={casting.roles ?? []} />
      <Separator className="opacity-20 my-4" />
      {right}
    </div>
  );
};

const CastingDetailsDesktopPanel = ({ data }: { data: PublicCastingDetailsResponse }) => {
  const { t } = useTranslation();
  const casting = data.casting;
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

  const socialMediaItems =
    employerInfo.socialMedia?.links
      ?.filter((link) => !!link.url && link.url.trim().length > 0)
      .map((link) => {
        const href = normalizeExternalUrl(link.url);
        if (!href) return null;

        const iconName = getSocialMediaIconName(link.stringCode);
        if (!iconName) return null;

        return (
          <a key={link.optionId} href={href} target="_blank" rel="noopener noreferrer">
            <Icon name={iconName} variant="default" size={16} />
          </a>
        );
      })
      .filter(Boolean) ?? [];

  const normalizedWebsiteUrl = normalizeExternalUrl(employerInfo.websiteUrl);

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

      <section className="flex flex-col gap-6">
        {roleTags.length > 0 && (
          <DesktopTagSection title={t('casting-database.detail.role_basic_info')} tags={roleTags} />
        )}
        {characteristicTags.length > 0 && (
          <DesktopTagSection title={t('casting-database.detail.role_characteristics')} tags={characteristicTags} />
        )}
        {skillTags.length > 0 && (
          <DesktopTagSection title={t('casting-database.detail.role_skills')} tags={skillTags} />
        )}
      </section>

      <Separator className="opacity-20 my-6" />

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
                <span className="flex items-center gap-2">
                  {employerInfo.companyType?.stringCode ? (
                    <TagChip label={t(employerInfo.companyType.stringCode)} />
                  ) : null}
                  {normalizedWebsiteUrl ? (
                    <a href={normalizedWebsiteUrl} target="_blank" rel="noopener noreferrer">
                      <Icon name="web" variant="default" size={16} />
                    </a>
                  ) : null}
                  {socialMediaItems}
                </span>
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

const DesktopTagSection = ({ title, tags }: { title: string; tags: Array<{ key: string; label: string }> }) => {
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

const buildRoleTags = (role: CastingRole | null, t: (key: string) => string) => {
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

const buildCharacteristicTags = (role: CastingRole | null, t: (key: string) => string) => {
  if (!role) return [];

  const labels = [
    role.ethnicity?.stringCode ? t(role.ethnicity.stringCode) : null,
    formatBooleanLabeled({ labelKey: 'profile.characteristics.tattoo', value: role.tattoo, t }),
    formatBooleanLabeled({ labelKey: 'profile.characteristics.passport', value: role.passport, t }),
    formatBooleanLabeled({ labelKey: 'profile.characteristics.drivingLicense', value: role.drivingLicense, t }),
  ].filter((value): value is string => Boolean(value));

  return labels.map((label, index) => ({ key: `characteristic-${index}`, label }));
};

const toRequirements = (role: CastingRole | null): CastingRequirement[] => {
  if (!role?.id) return [];
  if (!role.requiresAudio && !role.requiresVideo) return [];

  return [
    {
      id: role.id,
      roleId: role.id,
      description: role.requirementDescription ?? '',
      requiresAudio: role.requiresAudio,
      requiresVideo: role.requiresVideo,
    },
  ];
};

export default CastingDetailsPage;
