import { Button, Label } from 'autocasting-ui-library-padimasso';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import type { RadioOption } from '../../../../../shared/components/Form/RadioGroupField';
import { Icon } from '../../../../../shared/components/Icon/Icon';
import { SectionTitle } from '../../../../../shared/components/Section';
import { useCastingRequirements } from '../../hooks/useCastingRequirements';
import EmployerCastingRequirementCard from '../EmployerCastingRequirementCard';
import CastingRequirementModal from '../Form/Requirement/CastingRequirementModal';

type RoleRef = {
  id: string;
  roleName: string | null;
};

const pickStringId = (v: any): string => (typeof v === 'string' && v.trim() ? v.trim() : '');

const readRoleIdsFromRequirement = (req: any): string[] => {
  const out: string[] = [];

  const push = (v: any) => {
    const id = pickStringId(v);
    if (id) out.push(id);
  };

  const pushMany = (arr: any) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((x) => push(x));
  };

  pushMany(req?.roleIds);
  pushMany(req?.castingRoleIds);

  push(req?.castingRoleId);
  push(req?.roleId);

  push(req?.castingRole?.id);
  push(req?.role?.id);

  return Array.from(new Set(out));
};

const EmployerCastingRequirementsEditSection = ({ sectionId, roles }: { sectionId: string; roles: RoleRef[] }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { data = [] } = useCastingRequirements(sectionId);

  const roleOptions: RadioOption[] = useMemo(
    () =>
      (roles ?? []).map((r) => ({
        value: r.id,
        label: r.roleName ?? t('general.placeholder.role_name'),
      })),
    [roles, t]
  );

  const disabledRoleIds = useMemo(() => {
    const ids = new Set<string>();
    (data ?? []).forEach((req: any) => {
      readRoleIdsFromRequirement(req).forEach((id) => ids.add(id));
    });
    return Array.from(ids);
  }, [data]);

  const handleOpenModal = () => {
    openModal(
      <CastingRequirementModal
        mode="create"
        sectionId={sectionId}
        roleOptions={roleOptions}
        disabledRoleIds={disabledRoleIds}
        onSave={() => {
          console.log('save Requirement Modal');
          closeModal();
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

      {(data?.length ?? 0) > 0 ? (
        data.map((requirement: any) => (
          <EmployerCastingRequirementCard key={requirement.id} data={requirement} roleOptions={roleOptions} />
        ))
      ) : (
        <Label className="w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10">
          {t('employer_castings.page.empty_requirements')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRequirementsEditSection;
