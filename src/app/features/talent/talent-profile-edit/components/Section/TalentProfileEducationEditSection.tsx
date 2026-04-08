import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Icon } from 'autocasting-ui-library-padimasso';
import { SectionCard, SectionTitle } from '../../../../../shared/components/Section';
import { useEducationAutosave } from '../../hooks/autosaves';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { EducationForm } from '../Form';
import EducationModal from '../Form/Education/EducationModal';

const TalentProfileEducationEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
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

  const actionButtonRender = () => {
    return (
      <Button onClick={openCreateModal} className="flex items-center justify-center gap-2">
        <Icon name="plus" variant="white" size={16} />
        <span className="text-base font-medium">{t('profile.education.add_new')}</span>
      </Button>
    );
  };

  return (
    <DashboardSection>
      <SectionTitle title={t('profile.pills.education')} action={actionButtonRender()} />
      {profile.education.length > 0 && (
        <SectionCard>
          <EducationForm data={profile.education}></EducationForm>
        </SectionCard>
      )}
    </DashboardSection>
  );
};

export default TalentProfileEducationEditSection;
