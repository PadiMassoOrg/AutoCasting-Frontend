import { Icon, SectionCard, TagChip, type RadioOption } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { useCastingRequirementDeleteAutosave, useCastingRequirementPatchAutosave } from '../../hooks/autosaves';
import type { CastingRequirementFormKey } from '../../schemas/formSchema';
import type { EmployerCastingRequirementCardResponse } from '../../types/employerCastings.types';
import CastingRequirementDeleteModal from '../Form/Requirement/CastingRequirementDeleteModal';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

const EmployerCastingRequirementCard = ({
  data,
  roleOptions,
  sectionId,
}: {
  data: EmployerCastingRequirementCardResponse;
  roleOptions: RadioOption[];
  sectionId: string;
}) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const patchRequirement = useCastingRequirementPatchAutosave(sectionId);
  const deleteRequirement = useCastingRequirementDeleteAutosave(sectionId);

  const { roleName, requiresAudio, requiresVideo, description } = data;

  const handleEditModal = () => {
    openModal(
      <CastingRequirementModal
        mode="edit"
        initial={data}
        sectionId={sectionId}
        roleOptions={roleOptions}
        backendErrors={patchRequirement.fieldErrors as Partial<Record<CastingRequirementFormKey, string>>}
        clearBackendFieldError={patchRequirement.clearFieldError as (field: CastingRequirementFormKey) => void}
        onSave={async (draft) => {
          if (draft.mode !== 'edit') return;

          const result = await patchRequirement
            .submit({
              id: draft.id,
              requirementsSectionId: draft.requirementsSectionId,
              roleIds: draft.roleIds,
              requiresAudio: draft.requiresAudio,
              requiresVideo: draft.requiresVideo,
              description: draft.description?.trim() ? draft.description.trim() : undefined,
            })
            .catch(() => null);

          if (!result) return;

          closeModal();
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
        onConfirm={async () => {
          await deleteRequirement.submit({ id: data.id });
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
              {requiresAudio ? (
                <TagChip label={t('employer_castings.dashboard.requirements.requirement.audio_true')} />
              ) : null}
              {requiresVideo ? (
                <TagChip label={t('employer_castings.dashboard.requirements.requirement.video_true')} />
              ) : null}
            </div>
          </div>

          <Icon name="edit" variant="primary" onClick={handleEditModal} className="ml-8 lg:ml-0" />
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-[var(--color-secondary-grey-fonts)] text-sm font-light">{description}</p>
          <Icon name="delete" variant="danger" onClick={handleDeleteModal} className="ml-8 lg:ml-0" />
        </div>
      </div>
    </SectionCard>
  );
};

export default EmployerCastingRequirementCard;
