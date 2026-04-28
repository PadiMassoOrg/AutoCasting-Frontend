import { TagChip, Icon } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { SectionCard } from '../../../../../shared/components/Section';
import { formatAgeRange } from '../../../../../shared/utils/formatUtils';
import { useCastingRoleDeleteAutosave, useCastingRolePatchAutosave } from '../../hooks/autosaves';
import type { CastingRoleFormKey } from '../../schemas/formSchema';
import type { EmployerCastingRoleCardResponse } from '../../types/employerCastings.types';
import CastingRoleDeleteModal from '../Form/Role/CastingRoleDeleteModal';
import CastingRoleModal from '../Form/Role/CastingRoleModal';

const EmployerCastingRoleCard = ({ data }: { data: EmployerCastingRoleCardResponse }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const patchRole = useCastingRolePatchAutosave(data.sectionId);
  const deleteRole = useCastingRoleDeleteAutosave(data.sectionId);

  const { sectionId, roleName, roleType, gender, ageMin, ageMax, professions, skills } = data;

  const handleEditModal = () => {
    openModal(
      <CastingRoleModal
        mode="edit"
        initial={data}
        backendErrors={patchRole.fieldErrors as Partial<Record<CastingRoleFormKey, string>>}
        clearBackendFieldError={patchRole.clearFieldError as (field: CastingRoleFormKey) => void}
        onSave={async (draft) => {
          const result = await patchRole.submit({ ...draft, id: draft.id! }).catch(() => null);
          if (!result) return;
          closeModal();
        }}
        onCancel={closeModal}
        sectionId={sectionId}
      />,
      t('employer_castings.dashboard.roles.edit'),
      'lg'
    );
  };

  const handleDeleteModal = () => {
    openModal(
      <CastingRoleDeleteModal
        data={data}
        onCancel={closeModal}
        onConfirm={async () => {
          await deleteRole.submit({ id: data.id });
          closeModal();
        }}
      />,
      t('employer_castings.dashboard.roles.delete'),
      'lg'
    );
  };

  return (
    <SectionCard>
      <div className="w-full flex flex-row items-center justify-between">
        <p className="font-semibold">{roleName}</p>
        <div className="flex flex-row gap-2 items-center shrink-0">
          <Icon name="edit" variant="primary" onClick={handleEditModal}></Icon>
          <Icon name="delete" variant="danger" onClick={handleDeleteModal}></Icon>
        </div>
      </div>
      <div className="flex flex-row items-center flex-wrap gap-2 mt-4">
        <TagChip label={t(gender.stringCode)}></TagChip>
        <TagChip label={formatAgeRange(ageMin, ageMax, t)}></TagChip>
        {professions.map((p) => (
          <TagChip label={t(p.stringCode)} key={p.id}></TagChip>
        ))}
        <TagChip label={t(roleType.stringCode)}></TagChip>
        {skills.map((s) => (
          <TagChip label={t(s.categoryStringCode!) + ': ' + t(s.stringCode)} key={s.id}></TagChip>
        ))}
      </div>
    </SectionCard>
  );
};

export default EmployerCastingRoleCard;
