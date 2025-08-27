import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../context/ModalContext';
import { useCreditsAutosave } from '../../../../hooks/autosaves';
import type { Credit } from '../../../../types/profile.types';
import CreditModal, { type DraftCredit } from './CreditModal';
import GroupedCredits from './GroupedCredits';

export default function CreditsForm({ data }: { data: Credit[] }) {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  const [credits, setCredits] = useState<Credit[]>(data ?? []);

  const openCreateModal = () => {
    openModal(
      <CreditModal
        mode="create"
        onCancel={closeModal}
        onSave={async (draft) => {
          await createCredit(draft); // sin id
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
        onSave={async (draft) => {
          await updateCredit(draft as DraftCredit); // con id
          closeModal();
        }}
      />,
      t('profile.credits.edit'),
      'lg'
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-base">{t('profile.credits.credits')}</h3>
      <Button onClick={openCreateModal} className="flex flex-row items-center justify-center gap-2">
        <span className="text-3xl mb-1 font-extralight">+</span>
        <span className="text-base font-medium">{t('profile.credits.add_new')}</span>
      </Button>
      <Separator className="opacity-20 my-2" />
      {credits.length > 0 && <GroupedCredits data={credits} />}
    </div>
  );
}
