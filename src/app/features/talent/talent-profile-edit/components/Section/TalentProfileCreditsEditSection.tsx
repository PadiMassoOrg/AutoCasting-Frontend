import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Button, Icon } from 'autocasting-ui-library-padimasso';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import { useCreditAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CreditsForm } from '../Form';
import CreditModal from '../Form/Credits/CreditModal';

const TalentProfileCreditsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
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

  const actionButtonRender = () => {
    return (
      <Button onClick={openCreateModal} className="flex flex-row gap-2 items-center justify-center">
        <Icon name="plus" variant="white" size={16} />
        <span className="text-base font-medium">{t('profile.credits.add_new')}</span>
      </Button>
    );
  };

  return (
    <DashboardSection>
      <SectionTitle title={t('profile.pills.credits')} action={actionButtonRender()} />
      {profile.credits.length > 0 && (
        <SectionCard>
          <CreditsForm data={profile.credits}></CreditsForm>
        </SectionCard>
      )}
    </DashboardSection>
  );
};

export default TalentProfileCreditsEditSection;
