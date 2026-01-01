import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import { useCastingRequirements } from '../../hooks/useCastingRequirements';
import EmployerCastingRequirementCard from '../EmployerCastingRequirementCard';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

const EmployerCastingRequirementsEditSection = ({ sectionId }: { sectionId: string }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { data } = useCastingRequirements(sectionId);

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

  console.log(data);

  const actionButtonRender = () => (
    <Button onClick={handleOpenModal} className="flex flex-row items-center justify-center gap-2">
      <Icon name="plus" variant="white" size={16} />
      <span className="text-base font-medium">{t('employer_castings.dashboard.requirements.add_new')}</span>
    </Button>
  );
  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.requirements.requirements')} action={actionButtonRender()} />
      {data?.length! > 0 ? (
        data?.map((requirement) => <EmployerCastingRequirementCard key={requirement.id} data={requirement} />)
      ) : (
        <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
          {t('employer_castings.page.empty_roles')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRequirementsEditSection;
