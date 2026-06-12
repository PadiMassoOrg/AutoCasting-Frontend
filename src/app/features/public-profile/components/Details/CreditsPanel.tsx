import { ChevronUpDown, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Credit } from '../../../talent/talent-profile-edit/types/talentProfile.types';

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

  if (!credits.length)
    return (
      <h2 className="h-full text-[var(--color-secondary-grey)] font-base flex flex-col items-center justify-center">
        {t('validation.profile.no_credits')}
      </h2>
    );
  return (
    <div className="flex flex-col" style={{ overflowAnchor: 'none' }}>
      {categories.map((catKey, index) => {
        const list = groups[catKey];
        if (!list?.length) return null;
        const isOpen = open[catKey] ?? true;
        let customClass = index === 0 ? 'pt-0 pb-6' : 'py-6';
        return (
          <div key={catKey}>
            <div className={customClass}>
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
                <span className="font-semibold text-base lg:text-[14px]">{t(catKey)}:</span>
                <ChevronUpDown open={isOpen} />
              </button>

              {/* Lista de Credits */}
              {isOpen && (
                <article id={`credits-${catKey}`} className="mt-3 flex flex-col gap-4">
                  {list.map((c) => (
                    <div key={c.id} className="rounded-xl border border-[var(--color-secondary-outline)] px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-semibold text-base lg:text-[14px] leading-snug">{c.projectName}</h4>
                        <span className="shrink-0 rounded-lg border border-[var(--color-secondary-outline)] px-3 py-1 text-base lg:text-[14px] font-light tracking-wide">
                          {c.year}
                        </span>
                      </div>
                      <div className="mt-3 text-base lg:text-[14px] font-light text-[var(--color-secondary-grey-fonts)]">
                        {c.role}
                        {c.producerName ? ` — ${c.producerName}` : ''}
                      </div>
                    </div>
                  ))}
                </article>
              )}
            </div>
            <Separator className="opacity-20" />
          </div>
        );
      })}
    </div>
  );
};

export default CreditsPanel;
