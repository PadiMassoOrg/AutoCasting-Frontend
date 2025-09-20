'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCachedSiteMetadataOption,
  useCachedSiteMetadataSlice,
} from '../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import type { TalentFiltersQS } from '../types/talent-database.types';

type Tri = '' | 'true' | 'false';

const boolToTri = (b: boolean | undefined): Tri => (b === undefined ? '' : b ? 'true' : 'false');
const triToBool = (s: Tri): boolean | undefined => (s === '' ? undefined : s === 'true');

const parseNum = (n: number): number | undefined => (Number.isNaN(n) ? undefined : n);

function toggleInArray(arr: string[] | undefined, id: string): string[] {
  const set = new Set(arr ?? []);
  set.has(id) ? set.delete(id) : set.add(id);
  return Array.from(set);
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="rounded-xl border bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">{title}</summary>
      <div className="px-4 pb-4 pt-2">{children}</div>
    </details>
  );
}

export function TalentFilterBar({
  value,
  onChange,
  onReset,
}: {
  value: TalentFiltersQS;
  onChange: (v: TalentFiltersQS) => void;
  onReset?: () => void;
}) {
  const { t } = useTranslation();

  const genders = useCachedSiteMetadataOption('genderOptions', t);
  const professionsRaw = useCachedSiteMetadataSlice('professions') as SiteMetadataObject[] | undefined;
  const hairOptions = useCachedSiteMetadataOption('colorOptions', t, 'hair');
  const eyeOptions = useCachedSiteMetadataOption('colorOptions', t, 'eye');
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

  const [stage, setStage] = useState(value.stageName ?? '');
  useMemo(() => {
    const id = setTimeout(() => onChange({ ...value, stageName: stage || undefined }), 300);
    return () => clearTimeout(id);
  }, [stage]);

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">{t('filters.title', 'Filtros')}</h3>
        <button type="button" className="text-xs underline" onClick={() => onReset?.()}>
          {t('filters.reset', 'Resetear filtros')}
        </button>
      </div>

      {/* Información básica */}
      <Section title={t('filters.basicInfo', 'Información Básica')}>
        {/* Nombre */}
        <div className="space-y-2">
          <label className="text-xs font-semibold">{t('filters.stageName', 'Nombre del Talento')}</label>
          <input
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder={t('filters.stageName.placeholder', 'Ej: Ricardo Darín')}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Rango etario */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold">{t('filters.ageMin', 'Mín')}</label>
            <input
              type="number"
              min={0}
              value={value.ageMin ?? ''}
              onChange={(e) => onChange({ ...value, ageMin: parseNum((e.target as HTMLInputElement).valueAsNumber) })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">{t('filters.ageMax', 'Máx')}</label>
            <input
              type="number"
              min={0}
              value={value.ageMax ?? ''}
              onChange={(e) => onChange({ ...value, ageMax: parseNum((e.target as HTMLInputElement).valueAsNumber) })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Género */}
        <div className="mt-3">
          <label className="text-xs font-semibold">{t('filters.gender', 'Género')}</label>
          <select
            value={value.genderId ?? ''}
            onChange={(e) => onChange({ ...value, genderId: e.target.value || undefined })}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">{t('filters.any', 'Seleccionar')}</option>
            {genders.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Profesiones + modo */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold">{t('filters.professions', 'Profesión')}</label>
            <div className="flex items-center gap-2 text-[11px]">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={(value.professionsMode ?? 'ANY') === 'ANY'}
                  onChange={() => onChange({ ...value, professionsMode: 'ANY' })}
                />{' '}
                ANY
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={value.professionsMode === 'ALL'}
                  onChange={() => onChange({ ...value, professionsMode: 'ALL' })}
                />{' '}
                ALL
              </label>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="sticky top-0 bg-white/90 px-2 py-2 text-xs border-b flex items-center gap-2">
              <button
                type="button"
                className="rounded border px-2 py-1"
                onClick={() => onChange({ ...value, professionId: (professionsRaw ?? []).map((p) => p.id) })}
              >
                {t('filters.selectAll', 'Seleccionar Todas')}
              </button>
              <button
                type="button"
                className="rounded border px-2 py-1"
                onClick={() => onChange({ ...value, professionId: undefined })}
              >
                {t('filters.clear', 'Limpiar')}
              </button>
              <span className="ml-auto text-neutral-500">
                {value.professionId?.length ?? 0} {t('filters.selected', 'Selecciones')}
              </span>
            </div>
            <div className="max-h-48 overflow-auto p-2 space-y-1">
              {(professionsRaw ?? []).map((p) => {
                const selected = (value.professionId ?? []).includes(p.id);
                return (
                  <label key={p.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        onChange({
                          ...value,
                          professionId: toggleInArray(value.professionId, p.id),
                        })
                      }
                    />
                    {t(p.stringCode)}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* Características */}
      <Section title={t('filters.characteristics', 'Características')}>
        {/* Altura */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold">{t('filters.heightMin', 'Altura mín. (cm)')}</label>
            <input
              type="number"
              min={0}
              value={value.heightMinCm ?? ''}
              onChange={(e) =>
                onChange({ ...value, heightMinCm: parseNum((e.target as HTMLInputElement).valueAsNumber) })
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">{t('filters.heightMax', 'Altura máx. (cm)')}</label>
            <input
              type="number"
              min={0}
              value={value.heightMaxCm ?? ''}
              onChange={(e) =>
                onChange({ ...value, heightMaxCm: parseNum((e.target as HTMLInputElement).valueAsNumber) })
              }
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Colores */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold">{t('filters.hair', 'Cabello')}</label>
            <select
              value={value.hairColorId ?? ''}
              onChange={(e) => onChange({ ...value, hairColorId: e.target.value || undefined })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">{t('filters.any', 'Color')}</option>
              {hairOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold">{t('filters.eyes', 'Ojos')}</label>
            <select
              value={value.eyeColorId ?? ''}
              onChange={(e) => onChange({ ...value, eyeColorId: e.target.value || undefined })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">{t('filters.any', 'Color')}</option>
              {eyeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
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
      </Section>

      {/* Habilidades */}
      <Section title={t('filters.skills', 'Habilidades')}>
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
      </Section>
    </aside>
  );
}
