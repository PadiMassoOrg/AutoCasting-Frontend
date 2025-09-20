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
import { FilterSection, MultiSelectDropdown } from './Filter';

type Tri = '' | 'true' | 'false';

const boolToTri = (b: boolean | undefined): Tri => (b === undefined ? '' : b ? 'true' : 'false');
const triToBool = (s: Tri): boolean | undefined => (s === '' ? undefined : s === 'true');

const parseNum = (n: number): number | undefined => (Number.isNaN(n) ? undefined : n);

function toggleInArray(arr: string[] | undefined, id: string): string[] {
  const set = new Set(arr ?? []);
  set.has(id) ? set.delete(id) : set.add(id);
  return Array.from(set);
}

export function TalentFilterBar({
  value,
  onChange,
}: {
  value: TalentFiltersQS;
  onChange: (v: TalentFiltersQS) => void;
}) {
  const { t } = useTranslation();

  const genderOptions = useCachedSiteMetadataOption('genderOptions', t);
  const professionsRaw = useCachedSiteMetadataSlice('professions') as SiteMetadataObject[] | undefined;
  const hairOptions = useCachedSiteMetadataOption('colorOptions', t, 'hair_color');
  const eyeOptions = useCachedSiteMetadataOption('colorOptions', t, 'eye_color');
  const dietOptions = useCachedSiteMetadataOption('dietOptions', t);

  const skillsRaw = useCachedSiteMetadataSlice('skills') as SiteMetadataObject[] | undefined;
  const skillsByCat = useMemo(() => {
    const groups = new Map<string, SiteMetadataObject[]>();
    (skillsRaw ?? []).forEach((s) => {
      const k = s.categoryStringCode ?? 'sitemetadata.category.other';
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(s);
    });
    return Array.from(groups.entries());
  }, [skillsRaw]);

  const [stage, _] = useState(value.stageName ?? '');
  useMemo(() => {
    const id = setTimeout(() => onChange({ ...value, stageName: stage || undefined }), 300);
    return () => clearTimeout(id);
  }, [stage]);

  return (
    <aside
      className="w-full
        flex flex-col gap-3 items-stretch  
        overflow-y-auto          
        min-h-0               
        [-webkit-overflow-scrolling:touch]"
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
            i18n={{
              selected: t('general.selections'),
              selectAll: t('general.select_all'),
            }}
            maxPanelHeight="16rem"
          />
        </div>
      </FilterSection>
      <Separator className="opacity-20 my-2"></Separator>
      {/* Características */}
      <FilterSection title={t('profile.characteristics.characteristics')}>
        {/* Altura */}
        <article className="flex flex-col gap-2">
          <label htmlFor="heightMin" className="text-sm font-semibold">
            {t('talent.filter.characteristics.height')}
          </label>
          <div className="flex flex-row gap-4">
            <FormInputField id="heightMin" placeholder={t('general.placeholder.min')} />
            <FormInputField id="heightMax" placeholder={t('general.placeholder.max')} />
          </div>
        </article>

        {/* Colores */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-semibold">{t('talent.filter.basic_info.profession')}</label>
        </div>
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-semibold">{t('talent.filter.basic_info.profession')}</label>
        </div>

        {/* Booleans triestado -> boolean | undefined */}
        <div className="mt-3 grid grid-cols-1 gap-2">
          {[
            { key: 'tattoo', label: t('filters.tattoo', 'Tatuajes') },
            { key: 'passport', label: t('filters.passport', 'Pasaporte') },
            { key: 'drivingLicense', label: t('filters.driving', 'Licencia de Conducir') },
          ].map(({ key, label }) => {
            const tri = boolToTri(value[key as keyof TalentFiltersQS] as boolean | undefined);
            return (
              <div key={key} className="grid grid-cols-[1fr,120px] items-center gap-2">
                <label className="text-xs font-semibold">{label}</label>
                <select
                  className="rounded-md border px-2 py-2 text-sm"
                  value={tri}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      [key]: triToBool(e.target.value as Tri),
                    } as TalentFiltersQS)
                  }
                >
                  <option value="">{t('filters.any', 'Cualquiera')}</option>
                  <option value="true">{t('filters.yes', 'Sí')}</option>
                  <option value="false">{t('filters.no', 'No')}</option>
                </select>
              </div>
            );
          })}
        </div>
      </FilterSection>
      <Separator className="opacity-20 my-2"></Separator>
      {/* Habilidades */}
      <FilterSection title={t('filters.skills', 'Habilidades')}>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold">{t('filters.matchMode', 'Modo')}</div>
          <div className="flex items-center gap-2 text-[11px]">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={(value.skillsMode ?? 'ANY') === 'ANY'}
                onChange={() => onChange({ ...value, skillsMode: 'ANY' })}
              />{' '}
              ANY
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={value.skillsMode === 'ALL'}
                onChange={() => onChange({ ...value, skillsMode: 'ALL' })}
              />{' '}
              ALL
            </label>
          </div>
        </div>

        <div className="space-y-3">
          {skillsByCat.map(([catCode, list]) => (
            <details key={catCode} className="rounded-md border">
              <summary className="cursor-pointer select-none px-2 py-2 text-xs font-semibold">
                {t(catCode)}
                <span className="ml-2 text-[11px] text-neutral-500">
                  {list.filter((s) => (value.skillId ?? []).includes(s.id)).length}{' '}
                  {t('filters.selected', 'Selecciones')}
                </span>
              </summary>

              <div className="border-t p-2">
                <div className="mb-1 flex gap-2">
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() =>
                      onChange({
                        ...value,
                        skillId: Array.from(new Set([...(value.skillId ?? []), ...list.map((s) => s.id)])),
                      })
                    }
                  >
                    {t('filters.selectAll', 'Seleccionar Todas')}
                  </button>
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() =>
                      onChange({
                        ...value,
                        skillId: (value.skillId ?? []).filter((id) => !list.find((s) => s.id === id)),
                      })
                    }
                  >
                    {t('filters.clear', 'Limpiar')}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {list.map((s) => {
                    const selected = (value.skillId ?? []).includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            onChange({
                              ...value,
                              skillId: toggleInArray(value.skillId, s.id),
                            })
                          }
                        />
                        {t(s.stringCode)}
                      </label>
                    );
                  })}
                </div>
              </div>
            </details>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
