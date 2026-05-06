import { Button, Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import type { SiteMetadataObject } from '../../../../sitemetadata/types/sitemetadata.types';
import { useSkillsAutosave } from '../../hooks/autosaves';
import { NewSkillModal } from '../Form/Skills/NewSkillModal';

type TalentProfileSkillsEditActionProps = {
  initialSkills: SiteMetadataObject[];
};

const TalentProfileSkillsEditAction = ({ initialSkills }: TalentProfileSkillsEditActionProps) => {
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
};

export default TalentProfileSkillsEditAction;
