import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUpDown } from '../../../../shared/components/Chevron';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
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

  const groups = useMemo(() => {
    const g: Record<string, SiteMetadataObject[]> = {};
    for (const s of skills) {
      const catKey = (s as any).categoryStringCode as string;
      (g[catKey] ??= []).push(s);
    }
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => t(a.stringCode).localeCompare(t(b.stringCode)));
    }
    return g;
  }, [skills, t]);

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
  if (!skills.length) return <h2 className="text-sm font-normal text-center">{t('general.no_data')}</h2>;
  return (
    <div className="flex flex-col" style={{ overflowAnchor: 'none' }}>
      {categories.map((catKey, index) => {
        const list = groups[catKey];
        if (!list?.length) return null;
        const isOpen = open[catKey] ?? true;
        let customClass = index === 0 ? 'pt-0 pb-6' : 'py-6';
        return (
          <>
            <article key={catKey} className={customClass}>
              <button
                type="button"
                onClick={() => {
                  const y = window.scrollY;
                  setOpen((s) => ({ ...s, [catKey]: !isOpen }));
                  requestAnimationFrame(() => window.scrollTo({ top: y }));
                }}
                className="w-full flex items-center justify-between cursor-pointer"
                aria-expanded={isOpen}
                aria-controls={`skills-${catKey}`}
              >
                <span className="font-semibold text-base lg:text-[14px]">{t(catKey)}:</span>
                <ChevronUpDown open={isOpen} />
              </button>
              {isOpen && (
                <article id={`skills-${catKey}`} className="mt-3 flex flex-wrap gap-2">
                  {list.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center rounded-xl border border-[var(--color-secondary-outline)] px-3 py-1 text-base lg:text-[14px]"
                      title={s.stringCode}
                    >
                      {t(s.stringCode)}
                    </span>
                  ))}
                </article>
              )}
            </article>
            <Separator className="opacity-20" />
          </>
        );
      })}
    </div>
  );
}
