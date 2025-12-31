import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../context/ModalContext';
import { Chip } from '../../../../shared/components/Chip/Chip';
import { Icon } from '../../../../shared/components/Icon/Icon';
import { SectionCard } from '../../../../shared/components/Section';
import { formatAgeRange } from '../../../../shared/utils/formatUtils';
import { useCastingRolePatchAutosave } from '../hooks/autosaves';
import type { EmployerCastingRoleCardResponse } from '../types/employerCastings.types';
import CastingRoleModal from './Form/Role/CastingRoleModal';

const EmployerCastingRoleCard = ({ data }: { data: EmployerCastingRoleCardResponse }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const patchRole = useCastingRolePatchAutosave(data.sectionId);

  const { sectionId, roleName, roleType, gender, ageMin, ageMax, professions, skills } = data;

  const handleEditModal = () => {
    openModal(
      <CastingRoleModal
        mode="edit"
        initial={data}
        onSave={(draft) => {
          patchRole.immediate({ ...draft, id: draft.id! });
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
    alert('Delete Modal');
  };

  return (
    <SectionCard>
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-semibold">{roleName}</h2>
        <span className="flex flex-row gap-2 items-center">
          <Icon name="edit" variant="primary" onClick={handleEditModal}></Icon>
          <Icon name="delete" variant="danger" onClick={handleDeleteModal}></Icon>
        </span>
      </div>
      <div className="flex flex-row items-center flex-wrap gap-2 mt-4">
        <Chip label={t(gender.stringCode)}></Chip>
        <Chip label={formatAgeRange(ageMin, ageMax, t)}></Chip>
        {professions.map((p) => (
          <Chip label={t(p.stringCode)} key={p.id}></Chip>
        ))}
        <Chip label={t(roleType.stringCode)}></Chip>
        {skills.map((s) => (
          <Chip label={t(s.categoryStringCode!) + ': ' + t(s.stringCode)} key={s.id}></Chip>
        ))}
      </div>
    </SectionCard>
  );
};

export default EmployerCastingRoleCard;
