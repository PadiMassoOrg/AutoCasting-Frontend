import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

const EmployerCastingRequirementsEditSection = () => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  // TODO: Handle EDIT or NEW
  const handleOpenModal = () => {
    openModal(
      <CastingRequirementModal
        onSave={() => {
          console.log('save Reuirement Modal');
        }}
        onCancel={closeModal}
      />,
      t('employer_castings.dashboard.requirements.add_new'),
      'lg'
    );
  };

  const actionButtonRender = () => (
    <Button onClick={handleOpenModal} className="flex flex-row items-center justify-center gap-2">
      <Icon name="plus" variant="white" size={16} />
      <span className="text-base font-medium">{t('employer_castings.dashboard.requirements.add_new')}</span>
    </Button>
  );
  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.requirements.requirements')} action={actionButtonRender()} />
    </DashboardSection>
  );
};

export default EmployerCastingRequirementsEditSection;
