import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '../../../../../shared/components/Chip/Chip';
import { useCachedSiteMetadataSlice } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import SearchWithSuggestions from '../../../../../shared/components/SearchWithSuggestions/SearchWithSuggestions';

export function NewSkillModal({
  initial,
  allOptions, // ✅ ahora usamos las opciones del hook obligado
  onSave,
  onCancel,
}: {
  initial: SiteMetadataObject[];
  allOptions: { value: string; label: string }[];
  onSave: (next: SiteMetadataObject[]) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<SiteMetadataObject[]>(initial);

  // cache crudo para recuperar categoryStringCode por id
  const rawList = (useCachedSiteMetadataSlice('skills') as SiteMetadataObject[] | undefined) ?? [];
  const rawById = useMemo(() => new Map(rawList.map((s) => [s.id, s])), [rawList]);

  const used = useMemo(() => new Set(draft.map((s) => s.id)), [draft]);

  // Sugerencias: "Category: Label" (ambos traducidos si tenés t)
  const suggestions = useMemo(
    () =>
      allOptions
        .filter((o) => !used.has(o.value))
        .map((o) => {
          const raw = rawById.get(o.value);
          const catLabel = raw?.categoryStringCode ? t(raw.categoryStringCode) : '';
          const text = catLabel ? `${catLabel}: ${o.label}` : o.label;
          return { id: o.value, text };
        }),
    [allOptions, used, rawById, t]
  );

  const addById = (id: string) => {
    if (used.has(id)) return;
    const raw = rawById.get(id);
    if (raw) {
      setDraft((prev) => [...prev, raw]);
    } else {
      // fallback por si falta en crudo
      const opt = allOptions.find((o) => o.value === id);
      if (!opt) return;
      setDraft((prev) => [...prev, { id, stringCode: opt.label }]);
    }
  };

  const remove = (id: string) => setDraft((prev) => prev.filter((s) => s.id !== id));

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
            <Chip key={s.id} label={s.stringCode} onRemove={() => remove(s.id)} t={t} />
          ))}
        </div>
      )}

      <Separator className="opacity-20 mb-5" />
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={() => onSave(draft)}>{t('buttons.save')}</Button>
      </div>
    </article>
  );
}
