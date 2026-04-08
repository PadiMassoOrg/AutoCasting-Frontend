import { useQueryClient } from '@tanstack/react-query';
import { Button, Icon, Label } from 'autocasting-ui-library-padimasso';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { SectionTitle } from '../../../../../shared/components/Section';
import ServerError from '../../../../../shared/components/ServerError/ServerError';
import { useEmployerCastingIds } from '../../context/EmployerCastingContext';
import { useSyncCastingSectionStatus } from '../../context/useSyncCastingSectionStatus';
import { useCastingRoleCreateAutosave } from '../../hooks/autosaves';
import { useSectionRoles } from '../../hooks/section/useSectionRoles';
import type { CastingRoleFormKey } from '../../schemas/formSchema';
import { EMPLOYER_CASTING_CACHE_KEY } from '../../services/employerCastingService';
import { EmployerCastingRoleCard } from '../Card';
import CastingRoleModal from '../Form/Role/CastingRoleModal';

const EmployerCastingRolesEditSection = ({ sectionId }: { sectionId: string }) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const { defaultCode } = useEmployerCastingIds();
  const { data, isLoading, error } = useSectionRoles(sectionId);
  const createRoleMutation = useCastingRoleCreateAutosave(sectionId);

  useSyncCastingSectionStatus('roles', data?.sectionStatus);

  const prevCountRef = useRef<number | null>(null);
  const currentCount = data?.roles?.length ?? 0;

  useEffect(() => {
    if (prevCountRef.current === null) {
      prevCountRef.current = currentCount;
      return;
    }

    if (prevCountRef.current !== currentCount) {
      prevCountRef.current = currentCount;
      queryClient.invalidateQueries({
        queryKey: [...EMPLOYER_CASTING_CACHE_KEY, defaultCode],
      });
    }
  }, [currentCount, defaultCode, queryClient]);

  if (isLoading || !data) return null;
  if (error) return <ServerError />;

  const handleOpenModal = () => {
    openModal(
      <CastingRoleModal
        mode="create"
        backendErrors={createRoleMutation.fieldErrors as Partial<Record<CastingRoleFormKey, string>>}
        clearBackendFieldError={createRoleMutation.clearFieldError as (field: CastingRoleFormKey) => void}
        onSave={async (draft) => {
          const result = await createRoleMutation.submit(draft).catch(() => null);
          if (!result) return;
          closeModal();
        }}
        onCancel={closeModal}
        sectionId={sectionId}
      />,
      t('employer_castings.dashboard.roles.add_new'),
      'lg'
    );
  };

  const actionButtonRender = () => (
    <Button variant="primary" onClick={handleOpenModal}>
      <span className="flex flex-row items-center gap-2">
        <Icon name="plus" variant="white" size={16}></Icon>
        {t('employer_castings.dashboard.roles.add_new')}
      </span>
    </Button>
  );

  return (
    <DashboardSection>
      <SectionTitle title={t('employer_castings.dashboard.roles.roles')} action={actionButtonRender()} />
      {(data.roles?.length ?? 0) > 0 ? (
        data.roles?.map((role) => <EmployerCastingRoleCard data={role} key={role.id} />)
      ) : (
        <Label className="w-full text-center text-(--color-secondary-grey-fonts) pt-10">
          {t('employer_castings.page.empty_roles')}
        </Label>
      )}
    </DashboardSection>
  );
};

export default EmployerCastingRolesEditSection;
