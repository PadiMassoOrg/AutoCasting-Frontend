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
import { BooleanRadioGroup, FilterSection, MultiSelectDropdown } from './Filter';

export function TalentFilterBar({
  value,
  onChange,
}: {
  value: TalentFiltersQS;
  onChange: (v: TalentFiltersQS) => void;
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

  const [stage, _] = useState(value.stageName ?? '');

  useMemo(() => {
    const id = setTimeout(() => onChange({ ...value, stageName: stage || undefined }), 300);
    return () => clearTimeout(id);
  }, [stage]);

  return (
    <aside
      className="w-full mt-2 flex flex-col items-stretch overflow-visible overflow-x-hidden"
      style={{ maxHeight: 'calc(var(--app-vh, 1vh) * 100)' }}
    >
      {/* Basic Info */}
      <FilterSection title={t('profile.basic_info.basic_info')} defaultOpen>
        <FormInputField
          id={'stageName'}
          label={t('talent.filter.basic_info.stage_name')}
          labelClassName="text-sm font-semibold"
          placeholder={t('general.placeholder.stage_name')}
        ></FormInputField>
        <article className="flex flex-col gap-2">
          <label htmlFor="ageMin" className="text-sm font-semibold">
            {t('talent.filter.basic_info.age_range')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField id="ageMin" placeholder={t('general.placeholder.min')} />
            <FormInputField id="ageMax" placeholder={t('general.placeholder.max')} />
          </div>
        </article>
        <FormSelectField
          id="genderId"
          label={t('profile.basic_info.gender')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.select')}
          options={genderOptions}
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
          />
        </div>
      </FilterSection>

      <Separator className="opacity-20 my-2"></Separator>

      {/* Characteristics */}
      <FilterSection title={t('profile.characteristics.characteristics')}>
        <article className="flex flex-col gap-2">
          <label htmlFor="heightMin" className="text-sm font-semibold">
            {t('talent.filter.characteristics.height')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField id="heightMin" placeholder={t('general.placeholder.min')} />
            <FormInputField id="heightMax" placeholder={t('general.placeholder.max')} />
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
            maxPanelHeight="1rem"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <BooleanRadioGroup
            key={'tattoo'}
            name="tattoo"
            label={t('profile.characteristics.tattoo')}
            value={value.tattoo}
            onChange={(next: boolean | undefined) => onChange({ ...value, tattoo: next })}
          />
          <BooleanRadioGroup
            key={'passport'}
            name="passport"
            label={t('profile.characteristics.passport')}
            value={value.passport}
            onChange={(next: boolean | undefined) => onChange({ ...value, passport: next })}
          />
          <BooleanRadioGroup
            key={'drivingLicense'}
            name="drivingLicense"
            label={t('profile.characteristics.drivingLicense')}
            value={value.drivingLicense}
            onChange={(next: boolean | undefined) => onChange({ ...value, drivingLicense: next })}
          />
        </div>
      </FilterSection>

      <Separator className="opacity-20 my-2"></Separator>

      {/* Skills */}
      <FilterSection title={t('filters.skills', 'Habilidades')}>
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
              />
            </div>
          );
        })}
      </FilterSection>
    </aside>
  );
}
