import { useTranslation } from 'react-i18next';
import type { CastingRole } from '../../../../../public-casting/types/publicCasting.types';

export type DraftCastingRole = {
  id?: string;
  rolesSectionId: string;
  productionTypeId: string;
  roleName: string;
  roleTypeId: string;
  genderId: string;
  ageMin: string;
  ageMax: string;
  description: string;
  professionIds: string[];
};

type Props = {
  mode: 'create' | 'edit';
  initial?: CastingRole;
  onSave: (draft: DraftCastingRole) => Promise<void> | void;
  onCancel: () => void;
};

const CastingRoleModal = ({ mode, initial, onSave, onCancel }: Props) => {
  const { t } = useTranslation();

  return <div>CastingRoleModal</div>;
};

export default CastingRoleModal;
