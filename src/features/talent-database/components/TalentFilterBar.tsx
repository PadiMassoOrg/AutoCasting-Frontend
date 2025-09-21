'use client';

import { FormInputField, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCachedSiteMetadataOption,
  useCachedSiteMetadataSlice,
} from '../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import type { TalentFiltersQS } from '../types/talent-database.types';
import MultiSelectDropdown from './Filter/MultiSelectDropdown';
import { BooleanRadioGroup, FilterSection } from './Filter';

export function TalentFilterBar({
  value,
  onChange,
  /** NUEVO: para que los MultiSelectDropdown forwardeen el scroll sobrante */
  forwardScrollToRef,
}: {
  value: TalentFiltersQS;
  onChange: (v: TalentFiltersQS) => void;
  forwardScrollToRef?: React.RefObject<HTMLElement | null>;
}) {
  const { t } = useTranslation();
  const genderOptions = useCachedSiteMetadataOption('genderOptions', t);
  const professionsRaw = useCachedSiteMetadataSlice('professions');
  const hairOptions = useCachedSiteMetadataOption('colorOptions', t, 'hair_color');
  const eyeOptions = useCachedSiteMetadataOption('colorOptions', t, 'eye_color');
  const skillsRaw = useCachedSiteMetadataSlice('skills');

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
    () => [{ value: 'NULL', label: t('general.any') }, ...genderOptions],
    [genderOptions, t]
  );

  // Handlers
  const [stage, _] = useState(value.stageName ?? '');
  useMemo(() => {
    const id = setTimeout(() => onChange({ ...value, stageName: stage || undefined }), 300);
    return () => clearTimeout(id);
  }, [stage]);

  const parseNum = (s: string): number | undefined => {
    if (s == null) return undefined;
    const trimmed = s.trim();
    if (trimmed === '') return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
  };

  const hasText = (s?: string | null) => !!s && s.trim().length > 0;
  const hasAny = (arr?: unknown[]) => (arr?.length ?? 0) > 0;
  const hasRange = (min?: number, max?: number) => min != null || max != null;
  const genderActive = (value.genderIds ?? []).some((id) => id !== 'NULL');

  // Counts
  const basicCount =
    (hasText(value.stageName) ? 1 : 0) +
    (hasRange(value.ageMin, value.ageMax) ? 1 : 0) +
    (genderActive ? 1 : 0) +
    (hasAny(value.professionId) ? 1 : 0);

  const characteristicsCount =
    (hasRange(value.heightMinCm, value.heightMaxCm) ? 1 : 0) +
    (value.hairColorId ? 1 : 0) +
    (value.eyeColorId ? 1 : 0) +
    (value.tattoo !== undefined ? 1 : 0) +
    (value.passport !== undefined ? 1 : 0) +
    (value.drivingLicense !== undefined ? 1 : 0);

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
    <aside
      className="w-full flex flex-col items-stretch overflow-visible overflow-x-hidden"
      style={{ maxHeight: 'calc(var(--app-vh, 1vh) * 100)' }}
    >
      <FilterSection title={t('profile.basic_info.basic_info')} count={basicCount}>
        <FormInputField
          id="stageName"
          label={t('talent.filter.basic_info.stage_name')}
          labelClassName="text-sm font-semibold"
          placeholder={t('general.placeholder.stage_name')}
          value={value.stageName ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...value, stageName: e.target.value || undefined })
          }
        />
        <article className="flex flex-col gap-2">
          <label htmlFor="ageMin" className="text-sm font-semibold">
            {t('talent.filter.basic_info.age_range')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField
              id="ageMin"
              inputMode="numeric"
              placeholder={t('general.placeholder.min')}
              value={value.ageMin ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ ...value, ageMin: parseNum(e.target.value) })
              }
            />
            <FormInputField
              id="ageMax"
              inputMode="numeric"
              placeholder={t('general.placeholder.max')}
              value={value.ageMax ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ ...value, ageMax: parseNum(e.target.value) })
              }
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

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-semibold">{t('talent.filter.basic_info.profession')}</label>
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

      <Separator className="opacity-20 my-2" />

      {/* ===== Características ===== */}
      <FilterSection title={t('profile.characteristics.characteristics')} count={characteristicsCount}>
        <article className="flex flex-col gap-2">
          <label htmlFor="heightMin" className="text-sm font-semibold">
            {t('talent.filter.characteristics.height')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField
              id="heightMin"
              inputMode="numeric"
              placeholder={t('general.placeholder.min')}
              value={value.heightMinCm ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ ...value, heightMinCm: parseNum(e.target.value) })
              }
            />
            <FormInputField
              id="heightMax"
              inputMode="numeric"
              placeholder={t('general.placeholder.max')}
              value={value.heightMaxCm ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ ...value, heightMaxCm: parseNum(e.target.value) })
              }
            />
          </div>
        </article>

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-semibold">{t('profile.characteristics.hairColor')}</label>
          <MultiSelectDropdown
            mode="single"
            options={hairOptions}
            getId={(o) => o.value}
            getLabel={(o) => o.label}
            selected={value.hairColorId}
            onChange={(id) => onChange({ ...value, hairColorId: id })}
            maxPanelHeight="16rem"
            forwardScrollToRef={forwardScrollToRef}
          />
        </div>

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-semibold">{t('profile.characteristics.eyeColor')}</label>
          <MultiSelectDropdown
            mode="single"
            options={eyeOptions}
            getId={(o) => o.value}
            getLabel={(o) => o.label}
            selected={value.eyeColorId}
            onChange={(id) => onChange({ ...value, eyeColorId: id })}
            maxPanelHeight="16rem"
            forwardScrollToRef={forwardScrollToRef}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <BooleanRadioGroup
            name="tattoo"
            label={t('profile.characteristics.tattoo')}
            value={value.tattoo}
            onChange={(next) => onChange({ ...value, tattoo: next })}
          />
          <BooleanRadioGroup
            name="passport"
            label={t('profile.characteristics.passport')}
            value={value.passport}
            onChange={(next) => onChange({ ...value, passport: next })}
          />
          <BooleanRadioGroup
            name="drivingLicense"
            label={t('profile.characteristics.drivingLicense')}
            value={value.drivingLicense}
            onChange={(next) => onChange({ ...value, drivingLicense: next })}
          />
        </div>
      </FilterSection>

      <Separator className="opacity-20 my-2" />

      {/* ===== Skills ===== */}
      <FilterSection title={t('filters.skills', 'Habilidades')} count={skillsCount}>
        {skillsCats.map(({ catCode, list, idSet }) => {
          const selectedGlobal = value.skillId ?? [];
          const selectedInCat = selectedGlobal.filter((id) => idSet.has(id));

          const handleCatChange = (nextIds: string[]) => {
            const rest = selectedGlobal.filter((id) => !idSet.has(id));
            const merged = Array.from(new Set([...rest, ...nextIds]));
            onChange({ ...value, skillId: merged.length ? merged : undefined });
          };

          return (
            <div key={catCode} className="w-full flex flex-col gap-1.5">
              <label className="text-sm font-semibold">{t(catCode)}</label>
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
