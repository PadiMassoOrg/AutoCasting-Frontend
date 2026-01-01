import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../context/ModalContext';
import { Chip } from '../../../../shared/components/Chip/Chip';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionCard } from '../../../../shared/components/Section';
import type { EmployerCastingRequirementCardResponse } from '../types/employerCastings.types';
import CastingRequirementDeleteModal from './Form/Requirement/CastingRequirementDeleteModal';
import CastingRequirementModal from './Form/Requirement/CastingRequirementModal';

const EmployerCastingRequirementCard = ({ data }: { data: EmployerCastingRequirementCardResponse }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();

  const { id, sectionId, roleName, requiresAudio, requiresVideo, description } = data;

  const handleEditModal = () => {
    openModal(
      <CastingRequirementModal
        onSave={() => {
          console.log('save Reuirement Modal');
        }}
        onCancel={closeModal}
      />,
      t('employer_castings.dashboard.requirements.edit'),
      'lg'
    );
  };

  const handleDeleteModal = () => {
    openModal(
      <CastingRequirementDeleteModal
        data={data}
        onCancel={closeModal}
        onConfirm={() => {
          closeModal();
        }}
      />,
      t('employer_castings.dashboard.requirements.delete'),
      'lg'
    );
  };

  return (
    <SectionCard>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <p className="font-semibold mr-4">{roleName}</p>
            <div className="flex flex-row gap-2 items-center shrink-0">
              {requiresAudio && (
                <Chip label={t('employer_castings.dashboard.requirements.requirement.audio_true')}></Chip>
              )}
              {requiresVideo && (
                <Chip label={t('employer_castings.dashboard.requirements.requirement.video_true')}></Chip>
              )}
            </div>
          </div>
          <Icon name="edit" variant="primary" onClick={handleEditModal} className="ml-8 lg:ml-0"></Icon>
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="text-[var(--color-secondary-grey-fonts)] text-sm font-light">{description}</p>
          <Icon name="delete" variant="danger" onClick={handleDeleteModal} className="ml-8 lg:ml-0"></Icon>
        </div>
      </div>
    </SectionCard>
  );
};

export default EmployerCastingRequirementCard;
