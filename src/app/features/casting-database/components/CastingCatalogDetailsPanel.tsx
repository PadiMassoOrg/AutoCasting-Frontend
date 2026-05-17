import { Button, Icon, Separator, TagChip } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/lib/routes';
import {
  formatAgeRange,
  formatBooleanLabeled,
  formatLocalDate,
  formatMemberSince,
} from '../../../shared/utils/formatUtils';
import type { CastingRoleResponse } from '../../employer/employer-castings/types/employerCastings.types';
import type { PublicCastingDetailsResponse } from '../../public-casting/types/publicCasting.types';

type Props = {
  data: PublicCastingDetailsResponse;
  selectedRoleId: string;
};

const CastingCatalogDetailsPanel = ({ data, selectedRoleId }: Props) => {
  const { t } = useTranslation();
  const casting = data.casting;
  const role = casting.roles.find((item) => item.id === selectedRoleId) ?? null;

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

  return (
    <div className="flex min-h-full flex-col p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-3">
            <h2 className="text-3xl font-bold text-(--color-primary-black) leading-tight">{casting.title}</h2>
            <div className="flex flex-wrap gap-2">
              {casting.projectType?.stringCode ? <TagChip label={t(casting.projectType.stringCode)} /> : null}
              {casting.castingModality?.stringCode ? <TagChip label={t(casting.castingModality.stringCode)} /> : null}
            </div>
          </div>

          {role ? (
            <Button asChild variant="primary" className="lg:max-w-[220px]">
              <Link to={`${ROUTES.PUBLIC_CASTING}/${casting.defaultCode}/roles/${role.id}`}>{t('general.apply')}</Link>
            </Button>
          ) : null}
        </div>

        <Separator className="opacity-20" />

        <div className="grid gap-3 text-sm text-(--color-secondary-grey-fonts) lg:grid-cols-2">
          {casting.locationText ? (
            <span className="flex items-center gap-2">
              <Icon name="location" className="opacity-30" />
              <p>{casting.locationText}</p>
            </span>
          ) : null}
          {casting.applicationDeadline ? (
            <span className="flex items-center gap-2">
              <Icon name="clock" className="opacity-30" />
              <p>{`${t('casting.basic_info.deadline_complete')} ${formatLocalDate(casting.applicationDeadline, 'long')}`}</p>
            </span>
          ) : null}
          {casting.shootingStartDate || casting.shootingEndDate ? (
            <span className="flex items-center gap-2 lg:col-span-2">
              <Icon name="calendar" className="opacity-30" />
              <p>{`${formatLocalDate(casting.shootingStartDate, 'long')} - ${formatLocalDate(casting.shootingEndDate, 'long')}`}</p>
            </span>
          ) : null}
        </div>

        {casting.description ? (
          <section className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-(--color-primary-black)">Descripción del Proyecto</h3>
            <p className="text-base font-light leading-7 text-(--color-primary-black)">{casting.description}</p>
          </section>
        ) : null}

        {casting.hasWardrobeFitting && casting.wardrobeFittingText ? (
          <section className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-(--color-primary-black)">Prueba de vestuario</h3>
            <p className="text-base font-light leading-7 text-(--color-primary-black)">{casting.wardrobeFittingText}</p>
          </section>
        ) : null}

        {role ? (
          <>
            <Separator className="opacity-20" />

            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-(--color-primary-black)">{role.roleName}</h3>
                {role.description ? (
                  <p className="text-base font-light leading-7 text-(--color-primary-black)">{role.description}</p>
                ) : null}
              </div>

              {roleTags.length > 0 ? <DetailTagSection title="Talento" tags={roleTags} /> : null}

              {characteristicTags.length > 0 ? (
                <DetailTagSection title="Características" tags={characteristicTags} />
              ) : null}

              {skillTags.length > 0 ? <DetailTagSection title="Skills" tags={skillTags} /> : null}
            </section>
          </>
        ) : null}

        {casting.employerInfo ? (
          <>
            <Separator className="opacity-20" />

            <section className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-(--color-primary-black)">Empresa</h3>
              <div className="flex items-center gap-4">
                <img
                  src={casting.employerInfo.imageUrl ?? ''}
                  alt={casting.employerInfo.companyName ?? 'Employer'}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-semibold">{casting.employerInfo.companyName}</h4>
                  {casting.employerInfo.companyType?.stringCode ? (
                    <TagChip label={t(casting.employerInfo.companyType.stringCode)} />
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 text-sm text-(--color-secondary-grey-fonts) lg:grid-cols-2">
                {casting.employerInfo.totalCastings != null ? (
                  <span className="flex items-center gap-2">
                    <Icon name="clapper" />
                    <p>
                      {casting.employerInfo.totalCastings} {t('casting-database.page.created_castings')}
                    </p>
                  </span>
                ) : null}
                {casting.employerInfo.memberSince ? (
                  <span className="flex items-center gap-2">
                    <Icon name="profile" />
                    <p>{formatMemberSince(casting.employerInfo.memberSince, t)}</p>
                  </span>
                ) : null}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

const DetailTagSection = ({ title, tags }: { title: string; tags: Array<{ key: string; label: string }> }) => {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-lg font-semibold text-(--color-primary-black)">{`${title}:`}</h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagChip key={tag.key} label={tag.label} />
        ))}
      </div>
    </div>
  );
};

const buildRoleTags = (role: CastingRoleResponse | null, t: (key: string) => string) => {
  if (!role) return [];

  const tags: Array<{ key: string; label: string }> = [];

  role.professions.forEach((profession) => {
    tags.push({ key: profession.id, label: t(profession.stringCode) });
  });

  if (role.roleType?.stringCode) {
    tags.push({ key: `role-type-${role.roleType.id}`, label: t(role.roleType.stringCode) });
  }

  if (role.gender?.stringCode) {
    tags.push({ key: `gender-${role.gender.id}`, label: t(role.gender.stringCode) });
  }

  if (role.ageMin != null || role.ageMax != null) {
    tags.push({
      key: 'age-range',
      label: formatAgeRange(role.ageMin ?? 0, role.ageMax ?? 0, t),
    });
  }

  return tags;
};

const buildCharacteristicTags = (role: CastingRoleResponse | null, t: (key: string) => string) => {
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
