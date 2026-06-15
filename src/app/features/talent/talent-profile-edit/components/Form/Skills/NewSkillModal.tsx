import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MultiSelectDropdown } from 'autocasting-ui-library-padimasso';
import { useCachedSiteMetadataSlice } from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import { usePendingAction } from 'autocasting-ui-library-padimasso';

export function NewSkillModal({
  initial,
  onSave,
  onCancel,
}: {
  initial: SiteMetadataObject[];
  onSave: (nextIds: string[]) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => initial.map((s) => s.id));
  const { isPending, execute } = usePendingAction();
  const skillsRaw = (useCachedSiteMetadataSlice('skills') as SiteMetadataObject[] | undefined) ?? [];

  const skillsByCat = useMemo(() => {
    const groups = new Map<string, SiteMetadataObject[]>();
    skillsRaw.forEach((s) => {
      const key = s.categoryStringCode ?? 'sitemetadata.category.other';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)?.push(s);
    });
    return Array.from(groups.entries());
  }, [skillsRaw]);

  const skillsCats = useMemo(
    () =>
      skillsByCat.map(([catCode, list]) => ({
        catCode,
        list,
        idSet: new Set(list.map((s) => s.id)),
      })),
    [skillsByCat]
  );

  const handleCatChange = (idSet: Set<string>, nextIds: string[]) => {
    const rest = selectedIds.filter((id) => !idSet.has(id));
    setSelectedIds(Array.from(new Set([...rest, ...nextIds])));
  };

  const handleSave = async () => execute(() => onSave(selectedIds));

  return (
    <article className="flex flex-col">
      {skillsCats.map(({ catCode, list, idSet }) => {
        const selectedInCat = selectedIds.filter((id) => idSet.has(id));

        return (
          <div key={catCode}>
            <h2 className="text-sm font-semibold">{t(catCode)}</h2>
            <MultiSelectDropdown
              options={list}
              getId={(skill) => skill.id}
              getLabel={(skill) => t(skill.stringCode)}
              selected={selectedInCat}
              onChange={(next) => handleCatChange(idSet, next)}
              maxPanelHeight="12rem"
            />
          </div>
        );
      })}

      <Separator className="opacity-20 mb-6" />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={handleSave} loading={isPending}>
          {t('buttons.save')}
        </Button>
      </div>
    </article>
  );
}
