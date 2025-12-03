import { Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../../../../shared/components/Icon/Icon';
import type { Credit } from '../../../types/talentProfile.types';

const ORDER_KEYS = [
  'sitemetadata.production_type.theatre',
  'sitemetadata.production_type.television_streaming',
  'sitemetadata.production_type.film',
  'sitemetadata.production_type.commercial',
];

type Props = {
  data: Credit[];
  onEdit: (credit: Credit) => void;
  onDelete: (credit: Credit) => void;
};

export default function GroupedCredits({ data, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  const groups = useMemo(() => {
    const g: Record<string, Credit[]> = {};
    for (const c of data) {
      const key = c.productionType?.stringCode ?? '—';
      (g[key] ??= []).push(c);
    }
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => {
        const ya = Number(a.year);
        const yb = Number(b.year);
        const bothNum = !Number.isNaN(ya) && !Number.isNaN(yb);
        if (bothNum && ya !== yb) return yb - ya;
        return (a.projectName || '').localeCompare(b.projectName || '');
      });
    }
    return g;
  }, [data]);

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

  const [open, setOpen] = useState<Record<string, boolean>>({});

  if (!data?.length) return null;

  return (
    <div className="flex flex-col" style={{ overflowAnchor: 'none' }}>
      {categories.map((catKey) => {
        const list = groups[catKey];
        if (!list?.length) return null;
        const isOpen = open[catKey] ?? true;

        return (
          <>
            <div key={catKey} className="w-full py-6">
              <span
                onClick={() => {
                  const y = window.scrollY;
                  setOpen((s) => ({ ...s, [catKey]: !isOpen }));
                  requestAnimationFrame(() => window.scrollTo({ top: y }));
                }}
                className="w-full flex items-center justify-between cursor-pointer"
                aria-expanded={isOpen}
                aria-controls={`credits-${catKey}`}
              >
                <span className="font-semibold text-base">{t(catKey)}:</span>
                <Chevron open={isOpen} />
              </span>

              {isOpen && (
                <article id={`credits-${catKey}`} className="mt-3 flex flex-col gap-4">
                  {list.map((c) => (
                    <article key={c.id} className="rounded-xl border border-[var(--color-secondary-outline)] px-4 py-3">
                      <div className="flex flex-row justify-between">
                        <div className="grow">
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
                        <div className="flex flex-col justify-around items-center ml-3 pl-3 border-l border-[var(--color-secondary-outline)]">
                          <Icon name="delete" variant="danger" size={20} onClick={() => onDelete(c)} />
                          <Icon name="edit" variant="primary" size={20} onClick={() => onEdit(c)} />
                        </div>
                      </div>
                    </article>
                  ))}
                </article>
              )}
            </div>
            <Separator className="opacity-20" />
          </>
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
