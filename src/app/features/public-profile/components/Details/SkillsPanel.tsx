import { Separator, TagChip } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

  if (!skills.length)
    return (
      <h2 className="w-full h-full text-[var(--color-secondary-grey)] font-base flex flex-col items-center justify-center">
        {t('validation.profile.no_skills')}
      </h2>
    );

  return (
    <div className="flex flex-col" style={{ overflowAnchor: 'none' }}>
      {categories.map((catKey, index) => {
        const list = groups[catKey];
        if (!list?.length) return null;
        const hasMultipleCategories = categories.length > 1;
        return (
          <div key={catKey}>
            <article>
              <span className="font-semibold text-base lg:text-[14px]">{t(catKey)}</span>
              <article id={`skills-${catKey}`} className="mt-2 flex flex-wrap gap-2">
                {list.map((s) => (
                  <TagChip key={s.id} label={t(s.stringCode)} />
                ))}
              </article>
            </article>
            {hasMultipleCategories && index < categories.length - 1 ? (
              <Separator className="opacity-20 my-4.5" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
