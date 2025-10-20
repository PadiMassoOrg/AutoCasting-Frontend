import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../context/ModalContext';
import { useCreditAutosave, useCreditDeleteAutosave, useEducationPatchAutosave } from '../../../hooks/autosaves';
import type { Credit } from '../../../types/talentProfile.types';
import CreditDeleteModal from './CreditDeleteModal';
import CreditModal from './CreditModal';
import GroupedCredits from './GroupedCredits';

export default function CreditsForm({ data }: { data: Credit[] }) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createMut = useCreditAutosave();
  const patchMut = useEducationPatchAutosave();
  const deleteMut = useCreditDeleteAutosave();

  const openCreateModal = () => {
    openModal(
      <CreditModal
        mode="create"
        onCancel={closeModal}
        onSave={(draft) => {
          createMut.immediate(draft);
          closeModal();
        }}
      />,
      t('profile.credits.add_new'),
      'lg'
    );
  };

  const openEditModal = (credit: Credit) => {
    openModal(
      <CreditModal
        mode="edit"
        initial={credit}
        onCancel={closeModal}
        onSave={(draft) => {
          patchMut.immediate(draft);
          closeModal();
        }}
      />,
      t('profile.credits.edit'),
      'lg'
    );
  };

  const openDeleteModal = (credit: Credit) => {
    openModal(
      <CreditDeleteModal
        credit={credit}
        onCancel={closeModal}
        onConfirm={() => {
          deleteMut.immediate({ id: credit.id });
          closeModal();
        }}
      />,
      t('profile.credits.delete'),
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
      <div>
        <Separator className="opacity-20 mt-6" />
        {data?.length > 0 && <GroupedCredits data={data} onEdit={openEditModal} onDelete={openDeleteModal} />}
      </div>
    </div>
  );
}
