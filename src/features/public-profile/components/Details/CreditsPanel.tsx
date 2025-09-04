import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUpDown } from '../../../../shared/components/Chevron';
import type { Credit } from '../../../profile-edit/types/profile.types';

const ORDER_KEYS = [
  'sitemetadata.production_type.theatre',
  'sitemetadata.production_type.television_streaming',
  'sitemetadata.production_type.film',
  'sitemetadata.production_type.commercial',
];

const CreditsPanel = ({ credits }: { credits: Credit[] }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const g: Record<string, Credit[]> = {};
    for (const c of credits) {
      const key = c.productionType.stringCode;
      (g[key] ??= []).push(c);
    }
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => {
        const ya = Number(a.year);
        const yb = Number(b.year);
        if (!Number.isNaN(ya) && !Number.isNaN(yb) && ya !== yb) return yb - ya;
        return (a.projectName || '').localeCompare(b.projectName || '');
      });
    }
    return g;
  }, [credits]);

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
    <div className="flex flex-col gap-6" style={{ overflowAnchor: 'none' }}>
      {categories.map((catKey) => {
        const list = groups[catKey];
        if (!list?.length) return null;
        const isOpen = open[catKey] ?? true;
        return (
          <div key={catKey} className="w-full">
            {/* Header colapsable */}
            <button
              type="button"
              onClick={() => {
                const y = window.scrollY;
                setOpen((s) => ({ ...s, [catKey]: !isOpen }));
                requestAnimationFrame(() => window.scrollTo({ top: y }));
              }}
              className="w-full flex items-center justify-between cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`credits-${catKey}`}
            >
              <span className="font-semibold text-lg">{t(catKey)}:</span>
              <ChevronUpDown open={isOpen} />
            </button>

            {/* Lista de Credits */}
            {isOpen && (
              <article id={`credits-${catKey}`} className="mt-3 flex flex-col gap-4">
                {list.map((c) => (
                  <div key={c.id} className="rounded-xl border border-[var(--color-secondary-outline)] px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-semibold text-base leading-snug">{c.projectName}</h4>
                      <span className="shrink-0 rounded-lg border border-[var(--color-secondary-outline)] px-3 py-1 text-base font-light tracking-wide">
                        {c.year}
                      </span>
                    </div>
                    <div className="mt-3 text-base font-light text-[var(--color-secondary-grey-fonts)]">
                      {c.role}
                      {c.producerName ? ` — ${c.producerName}` : ''}
                    </div>
                  </div>
                ))}
              </article>
            )}
            <Separator className="opacity-20 my-4" />
          </div>
        );
      })}
    </div>
  );
};

export default CreditsPanel;
