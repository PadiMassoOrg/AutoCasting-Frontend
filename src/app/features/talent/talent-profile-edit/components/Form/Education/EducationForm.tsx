import { Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../context/ModalContext';
import { useEducationDeleteAutosave, useEducationPatchAutosave } from '../../../hooks/autosaves';
import type { Education } from '../../../types/talentProfile.types';
import EducationDeleteModal from './EducationDeleteModal';
import EducationModal from './EducationModal';

export default function EducationForm({ data }: { data: Education[] }) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const patchMut = useEducationPatchAutosave();
  const deleteMut = useEducationDeleteAutosave();

  const openEditModal = (education: Education) => {
    openModal(
      <EducationModal
        mode="edit"
        initial={education}
        onCancel={closeModal}
        onSave={async (draft) => {
          await patchMut.submit(draft);
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
        onConfirm={async () => {
          await deleteMut.submit({ id: education.id });
          closeModal();
        }}
      />,
      t('profile.education.delete'),
      'sm'
    );
  };

  return (
    <article className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      {data.map((e) => (
        <article key={e.id} className="rounded-xl border border-[var(--color-secondary-outline)] px-4 py-3 lg:py-2">
          <div className="flex flex-row justify-between">
            <div className="grow">
              <div className="flex items-start justify-between gap-4">
                <h4
                  className="font-semibold text-base lg:text-[14px] leading-snug line-clamp-2 min-h-[2.75rem] lg:min-h-[2.2rem]"
                  title={e.courseName}
                >
                  {e.courseName}
                </h4>
                <span className="shrink-0 rounded-lg border border-[var(--color-secondary-outline)] px-3 py-1 text-base lg:text-[14px] font-light tracking-wide">
                  {e.graduationYear}
                </span>
              </div>
              <div
                className="mt-3 lg:mt-2 text-base lg:text-[14px] font-light text-[var(--color-secondary-grey-fonts)] line-clamp-2 min-h-[3rem] lg:min-h-[2.2rem]"
                title={e.institution}
              >
                {e.institution}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 min-w-8 ml-3 pl-3 border-l border-[var(--color-secondary-outline)]">
              <Icon name="delete" variant="danger" size={20} onClick={() => openDeleteModal(e)} />
              <Icon name="edit" variant="primary" size={20} onClick={() => openEditModal(e)} />
            </div>
          </div>
        </article>
      ))}
    </article>
  );
}
