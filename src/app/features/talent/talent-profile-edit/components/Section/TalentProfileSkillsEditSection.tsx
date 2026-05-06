import { Button, Icon } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { useSkillsAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import GroupedSkills from '../Form/Skills/GroupedSkills';
import { NewSkillModal } from '../Form/Skills/NewSkillModal';

type TalentProfileSkillsEditActionProps = {
  initialSkills: SiteMetadataObject[];
};

export function TalentProfileSkillsEditAction({ initialSkills }: TalentProfileSkillsEditActionProps) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const autosave = useSkillsAutosave();

  const handleOpenModal = () => {
    openModal(
      <NewSkillModal
        initial={initialSkills}
        onSave={(nextIds) => {
          autosave.immediate({ skillIds: nextIds });
          closeModal();
        }}
        onCancel={closeModal}
      />,
      t('profile.skills.add_new'),
      'lg'
    );
  };

  return (
    <Button
      onClick={handleOpenModal}
      variant="primaryOutline"
      className="flex flex-row items-center justify-center gap-2"
    >
      <Icon name="plus" variant="primary" size={16} />
      <span className="text-base font-medium">{t('profile.skills.add_new')}</span>
    </Button>
  );
}

const TalentProfileSkillsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  const autosave = useSkillsAutosave();
  const [skills, setSkills] = useState<SiteMetadataObject[]>(profile.skills ?? []);

  useEffect(() => {
    setSkills(profile.skills ?? []);
  }, [profile.skills]);

  const handleRemoveSkill = (id: string) => {
    const next = skills.filter((s) => s.id !== id);
    setSkills(next);
    autosave.immediate({ skillIds: next.map((s) => s.id) });
  };

  return skills.length > 0 ? <GroupedSkills skills={skills} onRemove={handleRemoveSkill} /> : null;
};

export default TalentProfileSkillsEditSection;
