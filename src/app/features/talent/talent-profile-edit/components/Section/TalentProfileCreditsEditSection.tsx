import { Button, Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { useCreditAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CreditsForm } from '../Form';
import CreditModal from '../Form/Credits/CreditModal';

export function TalentProfileCreditsEditAction() {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createMut = useCreditAutosave();

  const openCreateModal = () => {
    openModal(
      <CreditModal
        mode="create"
        onCancel={closeModal}
        onSave={async (draft) => {
          await createMut.submit(draft);
          closeModal();
        }}
      />,
      t('profile.credits.add_new'),
      'lg'
    );
  };

  return (
    <Button
      onClick={openCreateModal}
      variant="primaryOutline"
      className="flex flex-row gap-2 items-center justify-center"
    >
      <Icon name="plus" variant="primary" size={16} />
      <span className="text-base font-medium">{t('profile.credits.add_new')}</span>
    </Button>
  );
}

const TalentProfileCreditsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return profile.credits.length > 0 ? <CreditsForm data={profile.credits}></CreditsForm> : null;
};

export default TalentProfileCreditsEditSection;
