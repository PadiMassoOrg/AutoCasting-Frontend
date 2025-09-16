import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';

const ORDER_KEYS = [
  'sitemetadata.category.scenic',
  'sitemetadata.category.sport',
  'sitemetadata.category.physical',
  'sitemetadata.category.language',
  'sitemetadata.category.accent',
] as const;

function GroupedSkills({ skills }: { skills: SiteMetadataObject[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const allCategorized = useMemo(() => skills.length > 0 && skills.every((s: any) => !!s.categoryStringCode), [skills]);

  const groups = useMemo(() => {
    const g: Record<string, SiteMetadataObject[]> = {};
    if (!allCategorized) return g;

    for (const s of skills) {
      const cat = (s as any).categoryStringCode as string;
      (g[cat] ??= []).push(s);
    }
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => t(a.stringCode).localeCompare(t(b.stringCode)));
    }
    return g;
  }, [skills, allCategorized, t]);

  const categories = useMemo(() => {
    const cats = Object.keys(groups);
    return cats.sort((a, b) => {
      const ia = ORDER_KEYS.indexOf(a as any);
      const ib = ORDER_KEYS.indexOf(b as any);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return t(a).localeCompare(t(b));
    });
  }, [groups, t]);

  if (!skills?.length) return null;
  if (!allCategorized) return null;
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {categories.map((cat) => {
        const list = groups[cat];
        if (!list?.length) return null;
        const isOpen = open[cat] ?? true;

        return (
          <article key={cat}>
            <button
              type="button"
              className="w-full flex items-center justify-between cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`skills-${cat}`}
              onClick={() => setOpen((s) => ({ ...s, [cat]: !isOpen }))}
            >
              <span className="font-semibold text-base">{t(cat)}:</span>
              <svg
                className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>

            {isOpen && (
              <div id={`skills-${cat}`} className="mt-3 flex flex-wrap gap-2">
                {list.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center rounded-xl border border-[var(--color-secondary-outline)] px-3 py-1 text-base lg:text-[14px]"
                    title={s.stringCode}
                  >
                    {t(s.stringCode)}
                  </span>
                ))}
              </div>
            )}

            <Separator className="opacity-20 my-2" />
          </article>
        );
      })}
    </div>
  );
}

export default GroupedSkills;
