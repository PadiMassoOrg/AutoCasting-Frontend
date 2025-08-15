import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../types/profile.types';
import Separator from '../../../../../shared/components/A EXTRAER EN UI LIB/Separator/Separator';

type Props = { skills: SiteMetadataObject[] };

const ORDER_KEYS = [
  'sitemetadata.category.scenic',
  'sitemetadata.category.sport',
  'sitemetadata.category.physical',
  'sitemetadata.category.language',
  'sitemetadata.category.accent',
];

export default function SkillsPanel({ skills }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // Agrupa por categoryStringCode
  const groups = useMemo(() => {
    const g: Record<string, SiteMetadataObject[]> = {};
    for (const s of skills) {
      const catKey = (s as any).categoryStringCode as string;
      (g[catKey] ??= []).push(s);
    }
    // orden interno por label traducido
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => t(a.stringCode).localeCompare(t(b.stringCode)));
    }
    return g;
  }, [skills, t]);

  // Categorías ordenadas según ORDER_KEYS; resto por su título traducido
  const categories = useMemo(() => {
    const cats = Object.keys(groups);
    return cats.sort((a, b) => {
      const ia = ORDER_KEYS.indexOf(a);
      const ib = ORDER_KEYS.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return t(a).localeCompare(t(b));
    });
  }, [groups, t]);

  return (
    <div className="flex flex-col gap-4" style={{ overflowAnchor: 'none' }}>
      {categories.map((catKey) => {
        const list = groups[catKey];
        if (!list?.length) return null;
        const isOpen = open[catKey] ?? true;
        return (
          <article key={catKey}>
            <button
              type="button"
              onClick={() => {
                const y = window.scrollY; // evita “salto” al expandir/colapsar
                setOpen((s) => ({ ...s, [catKey]: !isOpen }));
                requestAnimationFrame(() => window.scrollTo({ top: y }));
              }}
              className="w-full flex items-center justify-between cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`skills-${catKey}`}
            >
              <span className="font-semibold text-lg">{t(catKey)}:</span>
              <Chevron open={isOpen} />
            </button>
            {/* Lista de Skills */}
            {isOpen && (
              <article id={`skills-${catKey}`} className="mt-3 flex flex-wrap gap-2">
                {list.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center rounded-xl border border-[var(--color-secondary-outline)] px-3 py-1 text-base"
                    title={s.stringCode}
                  >
                    {t(s.stringCode)}
                  </span>
                ))}
              </article>
            )}
            <Separator className="opacity-20 my-4" />
          </article>
        );
      })}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-7 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
