import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../context/ModalContext';
import { useCreditDeleteAutosave, useCreditPatchAutosave } from '../../../hooks/autosaves';
import type { Credit } from '../../../types/talentProfile.types';
import CreditDeleteModal from './CreditDeleteModal';
import CreditModal from './CreditModal';
import GroupedCredits from './GroupedCredits';

export default function CreditsForm({ data }: { data: Credit[] }) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  const patchMut = useCreditPatchAutosave();
  const deleteMut = useCreditDeleteAutosave();

  const openEditModal = (credit: Credit) => {
    openModal(
      <CreditModal
        mode="edit"
        initial={credit}
        onCancel={closeModal}
        onSave={async (draft) => {
          await patchMut.submit(draft);
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
        onConfirm={async () => {
          await deleteMut.submit({ id: credit.id });
          closeModal();
        }}
      />,
      t('profile.credits.delete'),
      'sm'
    );
  };

  return (
    <div>{data?.length > 0 && <GroupedCredits data={data} onEdit={openEditModal} onDelete={openDeleteModal} />}</div>
  );
}
