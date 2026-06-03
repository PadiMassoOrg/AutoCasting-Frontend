import { TagChip, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';

const ORDER_KEYS = [
  'sitemetadata.category.scenic',
  'sitemetadata.category.sport',
  'sitemetadata.category.physical',
  'sitemetadata.category.language',
  'sitemetadata.category.accent',
] as const;

function GroupedSkills({ skills, onRemove }: { skills: SiteMetadataObject[]; onRemove?: (id: string) => void }) {
  const { t } = useTranslation();

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

  if (!skills?.length || !allCategorized || categories.length === 0) return null;

  return (
    <div className="flex flex-col">
      {categories.map((cat) => {
        const list = groups[cat];
        if (!list?.length) return null;

        return (
          <div key={cat}>
            <article>
              <span className="font-semibold text-sm">{t(cat)}</span>

              <div id={`skills-${cat}`} className="mt-2 flex flex-wrap gap-2">
                {list.map((s) => (
                  <TagChip key={s.id} label={t(s.stringCode)} onRemove={() => onRemove && onRemove(s.id)}></TagChip>
                ))}
              </div>
            </article>
            <Separator className="opacity-20 my-4.5" />
          </div>
        );
      })}
    </div>
  );
}

export default GroupedSkills;
