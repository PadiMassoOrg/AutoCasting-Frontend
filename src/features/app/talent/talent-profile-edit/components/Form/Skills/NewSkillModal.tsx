import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '../../../../../../../shared/components/Chip/Chip';
import SearchWithSuggestions from '../../../../../../../shared/components/SearchWithSuggestions/SearchWithSuggestions';
import { useCachedSiteMetadataSlice } from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';

export function NewSkillModal({
  initial,
  allOptions,
  onSave,
  onCancel,
}: {
  initial: SiteMetadataObject[];
  allOptions: { value: string; label: string }[];
  onSave: (next: SiteMetadataObject[]) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SiteMetadataObject[]>([]);
  const rawList = (useCachedSiteMetadataSlice('skills') as SiteMetadataObject[] | undefined) ?? [];
  const rawById = useMemo(() => new Map(rawList.map((s) => [s.id, s])), [rawList]);

  const initialIds = useMemo(() => new Set(initial.map((s) => s.id)), [initial]);
  const draftIds = useMemo(() => new Set(draft.map((s) => s.id)), [draft]);
  const used = useMemo(() => new Set([...initialIds, ...draftIds]), [initialIds, draftIds]);

  const suggestions = useMemo(
    () =>
      allOptions
        .filter((o) => !used.has(o.value))
        .map((o) => {
          const raw = rawById.get(o.value);
          const catLabel = raw?.categoryStringCode ? t(raw.categoryStringCode) : '';
          const text = catLabel ? `${catLabel}: ${t(raw?.stringCode ?? o.label)}` : t(raw?.stringCode ?? o.label);
          return { id: o.value, text };
        }),
    [allOptions, used, rawById, t]
  );

  const addById = (id: string) => {
    if (used.has(id)) return;
    const raw = rawById.get(id);
    if (raw) setDraft((prev) => [...prev, raw]);
  };

  const remove = (id: string) => setDraft((prev) => prev.filter((s) => s.id !== id));

  const handleSave = () => {
    const mergedMap = new Map<string, SiteMetadataObject>();
    initial.forEach((s) => mergedMap.set(s.id, s));
    draft.forEach((s) => mergedMap.set(s.id, s));
    onSave(Array.from(mergedMap.values()));
  };

  return (
    <article className="flex flex-col gap-6">
      <SearchWithSuggestions
        label={t('profile.skills.add_new_subtitle')}
        placeholder={t('profile.skills.add_new_placeholder')}
        suggestions={suggestions}
        onSelect={addById}
      />

      {draft.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {draft.map((s) => (
            <Chip key={s.id} label={t(s.stringCode)} onRemove={() => remove(s.id)} t={t} />
          ))}
        </div>
      )}

      <Separator className="opacity-20 mb-5" />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={handleSave}>{t('buttons.save')}</Button>
      </div>
    </article>
  );
}
