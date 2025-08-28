import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../context/ModalContext';
import {
  useEducationAutosave,
  useEducationDeleteAutosave,
  useEducationPatchAutosave,
} from '../../../../hooks/autosaves';
import type { Education } from '../../../../types/profile.types';
import EducationDeleteModal from './EducationDeleteModal';
import EducationModal from './EducationModal';

export default function EducationForm({ data }: { data: Education[] }) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  const createMut = useEducationAutosave();
  const patchMut = useEducationPatchAutosave();
  const deleteMut = useEducationDeleteAutosave();

  const openCreateModal = () => {
    openModal(
      <EducationModal
        mode="create"
        onCancel={closeModal}
        onSave={(draft) => {
          createMut.immediate(draft); // esto actualiza el cache + invalida
          closeModal();
        }}
      />,
      t('profile.education.add_new'),
      'lg'
    );
  };

  const openEditModal = (education: Education) => {
    openModal(
      <EducationModal
        mode="edit"
        initial={education}
        onCancel={closeModal}
        onSave={(draft) => {
          patchMut.immediate(draft);
          closeModal();
        }}
      />,
      t('profile.education.edit'),
      'lg'
    );
  };

  const openDeleteModal = (education: Education) => {
    openModal(
      <EducationDeleteModal
        education={education}
        onCancel={closeModal}
        onConfirm={() => {
          deleteMut.immediate({ id: education.id });
          closeModal();
        }}
        t={t}
      />,
      t('profile.education.delete'),
      'sm'
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base">{t('profile.credits.credits')}</h3>
      <Button onClick={openCreateModal} className="flex items-center justify-center gap-2">
        <span className="text-3xl mb-1 font-extralight">+</span>
        <span className="text-base font-medium">{t('profile.credits.add_new')}</span>
      </Button>
      <Separator className="opacity-20 my-2" />
      {data?.length > 0 && <GroupedEducation data={data} onEdit={openEditModal} onDelete={openDeleteModal} />}
    </div>
  );
}
