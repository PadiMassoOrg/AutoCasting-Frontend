import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { useSkillsAutosave } from '../../../hooks/autosaves';
import GroupedSkills from './GroupedSkills';
import { NewSkillModal } from './NewSkillModal';

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
      />,
      t('profile.skills.add_new'),
      'lg'
    );
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => {
      const next = prev.filter((s) => s.id !== id);
      autosave.immediate({ skillIds: next.map((s) => s.id) });
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base">{t('profile.skills.skills')}</h3>
      <Button onClick={handleOpenModal} className="flex flex-row items-center justify-center gap-2">
        <span className="text-3xl mb-1 font-extralight">+</span>
        <span className="text-base font-medium">{t('profile.skills.add_new')}</span>
      </Button>
      <div>
        <Separator className="opacity-20 mt-6" />
        {skills.length > 0 && <GroupedSkills skills={skills} onRemove={handleRemoveSkill} />}
      </div>
    </div>
  );
}
