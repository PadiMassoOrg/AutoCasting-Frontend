import {
  BooleanRadioGroup,
  FilterSection,
  FormInputField,
  FormSelectField,
  LG_SCREEN_SIZE,
  MultiSelectDropdown,
  Separator,
  useMedia,
} from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommittedInt, useCommittedText } from '../../../shared/utils/formUtils';
import {
  useCachedSiteMetadataOption,
  useCachedSiteMetadataSlice,
} from '../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import { getTalentVisibleGenderOptions } from '../../sitemetadata/utils/siteMetadataUtils';
import type { TalentFiltersQS } from '../types/talent-database.types';
import { getTalentFilterCounts } from '../utils/talentDatabaseFilterCounts';

export function TalentFilterBar({
  value,
  onChange,
  onClose,
  forwardScrollToRef,
}: {
  value: TalentFiltersQS;
  onChange: (v: TalentFiltersQS) => void;
  onClose?: () => void;
  forwardScrollToRef?: React.RefObject<HTMLElement | null>;
}) {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const genderOptionsRaw = useCachedSiteMetadataSlice('genderOptions');
  const ethnicityOptions = useCachedSiteMetadataOption('ethnicityOptions', t);
  const professionsRaw = useCachedSiteMetadataSlice('professions');
  const hairOptions = useCachedSiteMetadataOption('colorOptions', t, 'hair_color');
  const eyeOptions = useCachedSiteMetadataOption('colorOptions', t, 'eye_color');
  const skillsRaw = useCachedSiteMetadataSlice('skills');

  const visibleGenderOptions = useMemo(() => getTalentVisibleGenderOptions(genderOptionsRaw), [genderOptionsRaw]);

  const genderOptions = useMemo(
    () =>
      visibleGenderOptions.map((option) => ({
        value: option.id,
        label: t(option.stringCode),
      })),
    [visibleGenderOptions, t]
  );

  const skillsByCat = useMemo(() => {
    const groups = new Map<string, SiteMetadataObject[]>();
    (skillsRaw ?? []).forEach((s) => {
      const k = s.categoryStringCode ?? 'sitemetadata.category.other';
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(s);
    });
    return Array.from(groups.entries());
  }, [skillsRaw]);

  const skillsCats = useMemo(
    () =>
      skillsByCat.map(([catCode, list]) => ({
        catCode,
        list,
        idSet: new Set(list.map((s) => s.id)),
      })),
    [skillsByCat]
  );

  const genderOptionsWithUnspecified = useMemo(
    () => [{ value: 'NULL', label: t('general.all') }, ...genderOptions],
    [genderOptions, t]
  );

  const ethnicityOptionsWithUnspecified = useMemo(
    () => [{ value: 'NULL', label: t('general.all') }, ...ethnicityOptions],
    [ethnicityOptions, t]
  );

  const stageName = useCommittedText(value.stageName ?? '', (v) => onChange({ ...value, stageName: v || undefined }));
  const ageMin = useCommittedInt(value.ageMin ?? null, (v) => onChange({ ...value, ageMin: v ?? undefined }), {
    allowNull: true,
  });
  const ageMax = useCommittedInt(value.ageMax ?? null, (v) => onChange({ ...value, ageMax: v ?? undefined }), {
    allowNull: true,
  });
  const hMin = useCommittedInt(value.heightMinCm ?? null, (v) => onChange({ ...value, heightMinCm: v ?? undefined }), {
    allowNull: true,
  });
  const hMax = useCommittedInt(value.heightMaxCm ?? null, (v) => onChange({ ...value, heightMaxCm: v ?? undefined }), {
    allowNull: true,
  });

  const { basicCount, characteristicsCount } = useMemo(
    () => getTalentFilterCounts(value, skillsRaw),
    [skillsRaw, value]
  );

  const skillsCount = useMemo(() => {
    const selected = value.skillId ?? [];
    if (selected.length === 0) return 0;
    const selectedSet = new Set(selected);
    return skillsCats.reduce((acc, { idSet }) => {
      for (const id of selectedSet) {
        if (idSet.has(id)) return acc + 1;
      }
      return acc;
    }, 0);
  }, [skillsCats, value.skillId]);

  return (
    <aside className="z-[300] w-full flex flex-col items-stretch overflow-auto overflow-x-hidden bg-[var(--primary-color-white)]">
      <header className="flex items-center justify-between gap-4">
        <h4 className="text-[14px] font-bold">{t('general.filter.title')}</h4>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close') || 'Cerrar'}
            className="cursor-pointer p-1 rounded-md text-3xl leading-none"
          >
            ×
          </button>
        ) : null}
      </header>

      <Separator className="opacity-20 mt-3" />

      <FilterSection title={t('profile.basic_info.basic_info')} count={basicCount} defaultOpen={isDesktop}>
        <FormInputField
          id="stageName"
          label={t('talent.filter.basic_info.stage_name')}
          labelClassName="text-sm font-semibold"
          placeholder={t('general.placeholder.stage_name')}
          value={stageName.value}
          onChange={stageName.onChange}
          onBlur={stageName.onBlur}
          onKeyDown={stageName.onKeyDown}
        />

        <article className="flex flex-col">
          <label htmlFor="ageMin" className="text-sm font-semibold mb-2">
            {t('talent.filter.basic_info.age_range')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField
              id="ageMin"
              inputMode="numeric"
              placeholder={t('general.placeholder.min')}
              value={ageMin.value}
              onChange={ageMin.onChange}
              onBlur={ageMin.onBlur}
              onKeyDown={ageMin.onKeyDown}
              error={ageMin.error ?? undefined}
            />
            <FormInputField
              id="ageMax"
              inputMode="numeric"
              placeholder={t('general.placeholder.max')}
              value={ageMax.value}
              onChange={ageMax.onChange}
              onBlur={ageMax.onBlur}
              onKeyDown={ageMax.onKeyDown}
              error={ageMax.error ?? undefined}
            />
          </div>
        </article>

        <FormSelectField
          id="genderId"
          label={t('profile.basic_info.gender')}
          labelClassName="font-semibold text-base"
          options={genderOptionsWithUnspecified}
          value={(value.genderIds && value.genderIds[0]) ?? 'NULL'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const v = e.target.value;
            onChange({ ...value, genderIds: v ? [v] : undefined });
          }}
        />

        <div>
          <h2 className="text-sm font-semibold mb-2">{t('talent.filter.basic_info.profession')}</h2>
          <MultiSelectDropdown
            options={professionsRaw ?? []}
            getId={(p) => p.id}
            getLabel={(p) => t(p.stringCode)}
            selected={value.professionId ?? []}
            onChange={(next) => onChange({ ...value, professionId: next.length ? next : undefined })}
            maxPanelHeight="16rem"
            forwardScrollToRef={forwardScrollToRef}
          />
        </div>
      </FilterSection>

      <Separator className="opacity-20" />

      <FilterSection title={t('profile.pills.characteristics')} count={characteristicsCount}>
        <article className="flex flex-col">
          <label htmlFor="heightMin" className="text-sm font-semibold mb-2">
            {t('talent.filter.characteristics.height')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField
              id="heightMin"
              inputMode="numeric"
              placeholder={t('general.placeholder.min')}
              value={hMin.value}
              onChange={hMin.onChange}
              onBlur={hMin.onBlur}
              onKeyDown={hMin.onKeyDown}
              error={hMin.error ?? undefined}
            />
            <FormInputField
              id="heightMax"
              inputMode="numeric"
              placeholder={t('general.placeholder.max')}
              value={hMax.value}
              onChange={hMax.onChange}
              onBlur={hMax.onBlur}
              onKeyDown={hMax.onKeyDown}
              error={hMax.error ?? undefined}
            />
          </div>
        </article>

        <FormSelectField
          id="ethnicityId"
          label={t('profile.characteristics.ethnicity')}
          labelClassName="font-semibold text-base"
          options={ethnicityOptionsWithUnspecified}
          value={(value.ethnicityIds && value.ethnicityIds[0]) ?? 'NULL'}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const v = e.target.value;
            onChange({ ...value, ethnicityIds: v ? [v] : undefined });
          }}
        />

        <div>
          <h2 className="text-sm font-semibold mb-2">{t('profile.characteristics.hairColor')}</h2>
          <MultiSelectDropdown
            options={hairOptions ?? []}
            getId={(o) => o.value}
            getLabel={(o) => o.label}
            selected={value.hairColorIds ?? []}
            onChange={(next) => onChange({ ...value, hairColorIds: next.length ? next : undefined })}
            maxPanelHeight="16rem"
            forwardScrollToRef={forwardScrollToRef}
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">{t('profile.characteristics.eyeColor')}</h2>
          <MultiSelectDropdown
            options={eyeOptions ?? []}
            getId={(o) => o.value}
            getLabel={(o) => o.label}
            selected={value.eyeColorIds ?? []}
            onChange={(next) => onChange({ ...value, eyeColorIds: next.length ? next : undefined })}
            maxPanelHeight="16rem"
            forwardScrollToRef={forwardScrollToRef}
          />
        </div>

        <div className="grid grid-cols-1">
          <BooleanRadioGroup
            name="tattoo"
            label={t('profile.characteristics.tattoo')}
            value={value.tattoo}
            onChange={(next) => onChange({ ...value, tattoo: next })}
            includeAnyOption
            anyOptionLabel={t('general.indistinct')}
            yesLabel={t('general.yes')}
            noLabel={t('general.no')}
          />
          <BooleanRadioGroup
            name="passport"
            label={t('profile.characteristics.passport')}
            value={value.passport}
            onChange={(next) => onChange({ ...value, passport: next })}
            includeAnyOption
            anyOptionLabel={t('general.indistinct')}
            yesLabel={t('general.yes')}
            noLabel={t('general.no')}
          />
          <BooleanRadioGroup
            name="drivingLicense"
            label={t('profile.characteristics.drivingLicense')}
            value={value.drivingLicense}
            onChange={(next) => onChange({ ...value, drivingLicense: next })}
            includeAnyOption
            anyOptionLabel={t('general.indistinct')}
            yesLabel={t('general.yes')}
            noLabel={t('general.no')}
          />
        </div>
      </FilterSection>

      <Separator className="opacity-20" />

      <FilterSection title={t('profile.pills.skills')} count={skillsCount}>
        {skillsCats.map(({ catCode, list, idSet }) => {
          const selectedGlobal = value.skillId ?? [];
          const selectedInCat = selectedGlobal.filter((id) => idSet.has(id));

          const handleCatChange = (nextIds: string[]) => {
            const rest = selectedGlobal.filter((id) => !idSet.has(id));
            const merged = Array.from(new Set([...rest, ...nextIds]));
            onChange({ ...value, skillId: merged.length ? merged : undefined });
          };

          return (
            <div key={catCode}>
              <h2 className="text-sm font-semibold mb-2">{t(catCode)}</h2>
              <MultiSelectDropdown
                options={list}
                getId={(s) => s.id}
                getLabel={(s) => t(s.stringCode)}
                selected={selectedInCat}
                onChange={handleCatChange}
                maxPanelHeight="16rem"
                forwardScrollToRef={forwardScrollToRef}
              />
            </div>
          );
        })}
      </FilterSection>
    </aside>
  );
}
