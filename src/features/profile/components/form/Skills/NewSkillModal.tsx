import { Button, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { Chip } from '../../../../../shared/components/Chip/Chip';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';

export function NewSkillModal({
  initial,
  allOptions,
  onSave,
  onCancel,
  t,
}: {
  initial: SiteMetadataObject[];
  allOptions: { value: string; label: string }[];
  onSave: (next: SiteMetadataObject[]) => void;
  onCancel: () => void;
  t: (k: string) => string;
}) {
  const [draft, setDraft] = useState<SiteMetadataObject[]>(initial);
  const [selectedId, setSelectedId] = useState<string>('');

  const remaining = useMemo(() => {
    const used = new Set(draft.map((s) => s.id));
    return allOptions.filter((o) => !used.has(o.value));
  }, [allOptions, draft]);

  const mkSkill = (id: string): SiteMetadataObject => {
    const opt = allOptions.find((o) => o.value === id);
    return { id, stringCode: opt?.label ?? id };
  };

  const addSelected = (id: string) => {
    if (!id) return;
    if (draft.some((s) => s.id === id)) return;
    setDraft((prev) => [...prev, mkSkill(id)]);
    setSelectedId('');
    const el = document.activeElement as HTMLElement | null;
    el?.blur();
  };

  const remove = (id: string) => setDraft((prev) => prev.filter((s) => s.id !== id));

  return (
    <article className="flex flex-col gap-6">
      <FormSelectField
        id="skillId"
        label={t('profile.skills.add_new_subtitle')}
        labelClassName="font-bold"
        placeholder={t('profile.skills.add_new_placeholder')}
        value={selectedId}
        onChange={(e) => addSelected(e.target.value)}
        options={remaining}
      />

      {draft.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {draft.map((s) => (
            <Chip key={s.id} label={s.stringCode} onRemove={() => remove(s.id)} t={t} />
          ))}
        </div>
      )}
      <Separator className="opacity-20 mb-5"></Separator>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={() => onSave(draft)}>{t('buttons.save')}</Button>
      </div>
    </article>
  );
}
