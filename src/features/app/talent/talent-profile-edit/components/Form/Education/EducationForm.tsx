import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../../context/ModalContext';
import deleteIcon from '../../../../../../../shared/icons/delete.svg';
import editIcon from '../../../../../../../shared/icons/edit.svg';
import { useEducationAutosave, useEducationDeleteAutosave, useEducationPatchAutosave } from '../../../hooks/autosaves';
import type { Education } from '../../../types/talentProfile.types';
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
          createMut.immediate(draft);
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
      />,
      t('profile.education.delete'),
      'sm'
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base">{t('profile.education.education')}</h3>
      <Button onClick={openCreateModal} className="flex items-center justify-center gap-2">
        <span className="text-3xl mb-1 font-extralight">+</span>
        <span className="text-base font-medium">{t('profile.education.add_new')}</span>
      </Button>

      <Separator className="opacity-20 my-2" />

      {data?.length > 0 && (
        <article className="flex flex-col gap-4">
          {data.map((e) => (
            <article key={e.id} className="rounded-xl border border-[var(--color-secondary-outline)] px-4 py-3">
              <div className="flex flex-row justify-between">
                <div className="grow">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-semibold text-base lg:text-[14px] leading-snug">{e.courseName}</h4>
                    <span className="shrink-0 rounded-lg border border-[var(--color-secondary-outline)] px-3 py-1 text-base lg:text-[14px] font-light tracking-wide">
                      {e.graduationYear}
                    </span>
                  </div>
                  <div className="mt-3 text-base lg:text-[14px] font-light text-[var(--color-secondary-grey-fonts)]">
                    {e.institution}
                  </div>
                </div>
                <div className="flex flex-col justify-around items-center ml-3 pl-3 border-l border-[var(--color-secondary-outline)]">
                  <span onClick={() => openDeleteModal(e)} className="cursor-pointer" aria-label="Delete">
                    <img src={deleteIcon} alt="" className="w-5" />
                  </span>
                  <span onClick={() => openEditModal(e)} className="cursor-pointer" aria-label="Edit">
                    <img src={editIcon} alt="" className="w-5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </article>
      )}
    </div>
  );
}
