import { Button, Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { useEducationAutosave } from '../../hooks/autosaves';
import EducationModal from '../Form/Education/EducationModal';

const TalentProfileEducationEditAction = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createMut = useEducationAutosave();

  const openCreateModal = () => {
    openModal(
      <EducationModal
        mode="create"
        onCancel={closeModal}
        onSave={async (draft) => {
          await createMut.submit(draft);
          closeModal();
        }}
      />,
      t('profile.education.add_new'),
      'lg'
    );
  };

  return (
    <Button onClick={openCreateModal} variant="primaryOutline" className="flex items-center justify-center gap-2">
      <Icon name="plus" variant="primary" size={16} />
      <span className="text-base font-medium">{t('profile.education.add_new')}</span>
    </Button>
  );
};

export default TalentProfileEducationEditAction;
