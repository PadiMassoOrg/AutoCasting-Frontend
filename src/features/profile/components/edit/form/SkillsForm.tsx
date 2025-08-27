import { Button, FormSelectField, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { useSkillsAutosave } from '../../../hooks/autosaves';

export default function SkillsForm({ data }: { data: SiteMetadataObject[] }) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const autosave = useSkillsAutosave();
  const [skills, setSkills] = useState<SiteMetadataObject[]>(data ?? []);

  useEffect(() => {
    setSkills(data ?? []);
  }, [JSON.stringify((data ?? []).map((s) => s.id))]);

  const skillOptions = useCachedSiteMetadataOption('skills', t);

  const handleOpenModal = () => {
    openModal(
      <NewSkillModal
        initial={skills}
        allOptions={skillOptions}
        onSave={(next) => {
          setSkills(next);
          autosave.immediate({ skillIds: next.map((s) => s.id) });
          closeModal();
        }}
        onCancel={closeModal}
        t={t}
      />,
      t('profile.skills.add_new'),
      'lg'
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base">{t('profile.skills.skills')}</h3>
      <Button onClick={handleOpenModal} className="flex flex-row items-center justify-center gap-2">
        <span className="text-3xl mb-1 font-extralight">+</span>
        <span className="text-base font-medium">{t('profile.skills.add_new')}</span>
      </Button>
      {/* TODO: Separar esto en distintas categorias */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <Chip key={s.id} label={t(s.stringCode)} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function NewSkillModal({
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

function Chip({ label, onRemove, t }: { label: string; onRemove?: () => void; t: (k: string) => string }) {
  return (
    <span className="flex items-center gap-1 rounded-xl border border-[var(--color-secondary-outline)] px-3 py-0.5">
      <p className="text-sm">{t(label)}</p>
      {onRemove && (
        <span onClick={onRemove} className="cursor-pointer text-xl font-semibold" aria-label="Remove">
          ×
        </span>
      )}
    </span>
  );
}
