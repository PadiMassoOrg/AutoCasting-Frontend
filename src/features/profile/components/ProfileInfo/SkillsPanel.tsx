import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../types/profile.types';

type Props = { skills: SiteMetadataObject[] };

type Category = 'PHYSICAL' | 'SPORT' | 'LANGUAGE' | 'ACCENTS' | string;

const ORDER: Category[] = ['PHYSICAL', 'SPORT', 'LANGUAGE', 'ACCENTS', 'OTHER'];

export default function SkillsPanel({ skills }: Props) {
  const { t } = useTranslation();

  const groups = useMemo(() => {
    const g: Record<string, SiteMetadataObject[]> = {};
    for (const s of skills) {
      const cat = (s.category as Category) ?? 'OTHER';
      (g[cat] ??= []).push(s);
    }
    // ordena por label traducido dentro de cada grupo
    for (const cat of Object.keys(g)) {
      g[cat].sort((a, b) => tr(t, a.stringCode).localeCompare(tr(t, b.stringCode)));
    }
    return g;
  }, [skills, t]);

  const categories = useMemo(() => {
    const cats = Object.keys(groups);
    // aplica orden preferido y deja el resto al final
    return [...ORDER.filter((c) => cats.includes(c)), ...cats.filter((c) => !ORDER.includes(c as Category))];
  }, [groups]);

  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-4">
      {categories.map((cat, idx) => {
        const list = groups[cat];
        if (!list || list.length === 0) return null;
        const isOpen = open[cat] ?? true;
        const title = categoryTitle(t, cat);

        return (
          <div key={cat} className="rounded-xl border p-3">
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [cat]: !isOpen }))}
              className="w-full flex items-center justify-between"
              aria-expanded={isOpen}
              aria-controls={`skills-${cat}`}
            >
              <span className="font-semibold">{title}:</span>
              <Chevron open={isOpen} />
            </button>

            {isOpen && (
              <div id={`skills-${cat}`} className="mt-3 flex flex-wrap gap-2">
                {list.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center rounded-full border px-3 py-1 text-sm"
                    title={s.stringCode}
                  >
                    {tr(t, s.stringCode)}
                  </span>
                ))}
              </div>
            )}

            {idx !== categories.length - 1 && <hr className="mt-3 opacity-20" />}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- helpers ---------------------------------- */

function tr(t: ReturnType<typeof useTranslation>['t'], stringCode: string) {
  const key = stringCode.startsWith('sitemetadata.') ? stringCode.replace(/^sitemetadata\./, '') : stringCode;
  const fromNs = t(key, { ns: 'sitemetadata', defaultValue: undefined as any });
  return fromNs && fromNs !== key ? fromNs : t(stringCode, { defaultValue: key });
}

function categoryTitle(t: ReturnType<typeof useTranslation>['t'], cat: string) {
  // Traducciones de los títulos de grupo
  const defaults: Record<string, string> = {
    PHYSICAL: 'Habilidades Escénicas',
    SPORT: 'Habilidades Físicas',
    LANGUAGE: 'Idiomas',
    ACCENTS: 'Acentos',
    OTHER: 'Otras habilidades',
  };
  return t(`profile.skills.groups.${cat}`, { defaultValue: defaults[cat] ?? defaults.OTHER });
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
