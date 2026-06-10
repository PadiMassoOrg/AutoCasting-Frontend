import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import {
  Button,
  DashboardLoadingLabel,
  DashboardShell,
  SectionCard,
  Separator,
  type OverflowMenuItem,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { useModal } from '../../../../context/ModalContext';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { ROUTES } from '../../../../shared/lib/routes';
import { stableStringify } from '../../../../shared/utils/stableStringify';
import { isCastingEditable } from '../../../sitemetadata/utils/siteMetadataUtils';
import CastingBasicInfoForm from '../components/Form/BasicInfo/CastingBasicInfoForm';
import CastingRoleForm from '../components/Form/Role/CastingRoleForm';
import { CastingCheckoutModal } from '../components/Modal/';
import { useCastingRoleById } from '../hooks/useCastingRoleById';
import { useDeleteCastingRoleMutation } from '../hooks/useDeleteCastingRoleMutation';
import { useDuplicateCastingRoleMutation } from '../hooks/useDuplicateCastingRoleMutation';
import { useEmployerCastingEditorBySlug } from '../hooks/useEmployerCastingDetailsBySlug';
import { useUpdateCastingMutation } from '../hooks/useUpdateCastingMutation';
import { useUpsertCastingRoleMutation } from '../hooks/useUpsertCastingRoleMutation';
import type { CastingBasicInfoFormData, CastingRoleFormData } from '../types/employerCastings.types';
import {
  createEmptyRoleDraft,
  toBasicInfoFormData,
  toCastingRoleRequest,
  toCastingUpsertRequest,
  toRoleFormData,
} from '../utils/employerCastingEditorFormMappers';

const buildRoleOverflowMenuItems = ({
  roleId,
  t,
  isDisabled,
  onDuplicate,
  onDelete,
}: {
  roleId: string;
  t: ReturnType<typeof useTranslation>['t'];
  isDisabled: boolean;
  onDuplicate: (roleId: string) => void;
  onDelete: (roleId: string) => void;
}): OverflowMenuItem[] => [
  {
    key: `duplicate-${roleId}`,
    label: t('general.duplicate'),
    iconName: 'duplicate',
    disabled: isDisabled,
    onSelect: () => onDuplicate(roleId),
  },
  {
    key: `delete-${roleId}`,
    label: t('general.delete'),
    iconName: 'delete',
    destructive: true,
    disabled: isDisabled,
    onSelect: () => onDelete(roleId),
  },
];

const EmployerCastingPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { openModal, closeModal } = useModal();
  const { data, isLoading, error } = useEmployerCastingEditorBySlug(slug);
  const basicInfoMutation = useUpdateCastingMutation(slug);
  const roleMutation = useUpsertCastingRoleMutation(slug);
  const deleteRoleMutation = useDeleteCastingRoleMutation(slug);
  const duplicateRoleMutation = useDuplicateCastingRoleMutation(slug);

  const [activeSectionKey, setActiveSectionKey] = useState<'basic' | 'roles'>('basic');
  const [draft, setDraft] = useState<CastingBasicInfoFormData | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | 'new' | null>(null);
  const [roleDraft, setRoleDraft] = useState<CastingRoleFormData | null>(null);
  const [isRoleFormValid, setIsRoleFormValid] = useState(false);
  const [roleFormRenderKey, setRoleFormRenderKey] = useState(0);

  const castingId = data?.id ?? null;

  const selectedRoleQuery = useCastingRoleById(selectedRoleId && selectedRoleId !== 'new' ? selectedRoleId : null);
  const roleCards = data?.roles ?? [];
  const initialDraft = useMemo(() => (data ? toBasicInfoFormData(data) : null), [data]);
  const currentRoleInitialDraft = useMemo(() => {
    if (selectedRoleId === 'new') return createEmptyRoleDraft(castingId);
    if (selectedRoleQuery.data) return toRoleFormData(selectedRoleQuery.data);
    return null;
  }, [castingId, selectedRoleId, selectedRoleQuery.data]);

  const resetRoleEditor = (nextRoleId: string | 'new', nextRoleDraft: CastingRoleFormData | null) => {
    setSelectedRoleId(nextRoleId);
    setRoleDraft(nextRoleDraft);
    roleMutation.clearAllBackendErrors();
    setIsRoleFormValid(false);
    setRoleFormRenderKey((prev) => prev + 1);
  };

  const startNewRoleDraft = () => {
    resetRoleEditor('new', createEmptyRoleDraft(castingId));
    setActiveSectionKey('roles');
  };

  const openExistingRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    roleMutation.clearAllBackendErrors();
    setIsRoleFormValid(false);
    setRoleFormRenderKey((prev) => prev + 1);
    setActiveSectionKey('roles');
  };

  useEffect(() => {
    if (!data) return;
    setDraft(initialDraft);
  }, [data, initialDraft]);

  useEffect(() => {
    if (selectedRoleId !== 'new') return;
    setRoleDraft(createEmptyRoleDraft(castingId));
  }, [castingId, selectedRoleId]);

  useEffect(() => {
    if (!selectedRoleQuery.data) return;
    setRoleDraft(toRoleFormData(selectedRoleQuery.data));
  }, [selectedRoleQuery.data]);

  if (error && !data) return <ServerError />;

  if (data && !isCastingEditable(data.castingStatus)) {
    return <Navigate to={ROUTES.EMPLOYER_CASTINGS} replace />;
  }

  const loadingSections: DashboardShellSection<'basic' | 'roles'>[] = [
    {
      key: 'basic',
      label: t('employer_castings.dashboard.basic_info.basic_info'),
      sectionTitle: t('employer_castings.dashboard.basic_info.basic_info'),
      render: () => <DashboardLoadingLabel />,
    },
    {
      key: 'roles',
      label: t('employer_castings.dashboard.roles.roles'),
      sectionTitle: t('employer_castings.dashboard.roles.roles'),
      render: () => <DashboardLoadingLabel />,
    },
  ];

  if (isLoading || !draft || !data) {
    return (
      <DashboardShell
        title={t('employer_castings.dashboard.title_edit')}
        sections={loadingSections}
        initialKey="basic"
      />
    );
  }

  const isDirty = initialDraft ? stableStringify(draft) !== stableStringify(initialDraft) : false;
  const hasTitle = draft.title.trim().length > 0;
  const isRoleDirty =
    !!roleDraft && !!currentRoleInitialDraft && stableStringify(roleDraft) !== stableStringify(currentRoleInitialDraft);
  const canSaveRole = Boolean(roleDraft && castingId && isRoleFormValid && isRoleDirty);

  const handleDeleteRole = async (roleId: string) => {
    const remainingRoles = roleCards.filter((role) => role.id !== roleId);
    const isDeletingSelectedRole = selectedRoleId === roleId;
    const nextSelectedRoleId = isDeletingSelectedRole ? (remainingRoles[0]?.id ?? 'new') : selectedRoleId;

    if (isDeletingSelectedRole && nextSelectedRoleId === 'new') {
      resetRoleEditor('new', createEmptyRoleDraft(castingId));
    } else if (isDeletingSelectedRole && nextSelectedRoleId) {
      setSelectedRoleId(nextSelectedRoleId);
      roleMutation.clearAllBackendErrors();
    }

    await deleteRoleMutation.mutateAsync({ roleId });
  };

  const handleBasicInfoSave = async () => {
    const payload = toCastingUpsertRequest(draft);
    await basicInfoMutation.submit(payload, data.id);
  };

  const handleRoleSave = async () => {
    if (!roleDraft || !castingId) return;
    const savedRole = await roleMutation.submit(toCastingRoleRequest(roleDraft, castingId), roleDraft.id ?? undefined);
    resetRoleEditor('new', createEmptyRoleDraft(savedRole.castingId));
  };

  const handleDuplicateRole = async (roleId: string) => {
    const sourceRole = roleCards.find((role) => role.id === roleId);
    const duplicateRoleName = t('employer_castings.dashboard.roles.duplicate_name', {
      name: sourceRole?.roleName ?? '',
    });
    const duplicatedRole = await duplicateRoleMutation.mutateAsync({ roleId, roleName: duplicateRoleName });
    resetRoleEditor(duplicatedRole.id, toRoleFormData(duplicatedRole));
    setActiveSectionKey('roles');
  };

  const openCheckoutModal = () => {
    openModal(
      <CastingCheckoutModal castingId={data.id} slug={slug ?? data.defaultCode} onClose={closeModal} />,
      t('employer_castings.dashboard.checkout.checkout_summary.title'),
      'xl_3'
    );
  };

  const sections: DashboardShellSection<'basic' | 'roles'>[] = [
    {
      key: 'basic',
      label: t('employer_castings.dashboard.basic_info.basic_info'),
      sectionTitle: t('employer_castings.dashboard.basic_info.basic_info'),
      sectionActions: (
        <Button
          variant="primary"
          onClick={handleBasicInfoSave}
          disabled={!hasTitle || !isDirty}
          loading={basicInfoMutation.isPending}
        >
          {t('general.save_changes')}
        </Button>
      ),
      render: () => (
        <CastingBasicInfoForm
          data={draft}
          backendErrors={basicInfoMutation.fieldErrors}
          onChange={(patch) => {
            setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
          }}
          onClearBackendError={basicInfoMutation.clearFieldError}
        />
      ),
    },
    {
      key: 'roles',
      label: t('employer_castings.dashboard.roles.roles'),
      onSelect: startNewRoleDraft,
      sectionTitle: t('employer_castings.dashboard.roles.roles'),
      sectionActions: (
        <Button variant="primary" onClick={handleRoleSave} disabled={!canSaveRole} loading={roleMutation.isPending}>
          {t('employer_castings.dashboard.roles.save_role')}
        </Button>
      ),
      menuAction: {
        label: t('employer_castings.dashboard.roles.add_new'),
        active: activeSectionKey === 'roles' && selectedRoleId === 'new',
        onClick: startNewRoleDraft,
      },
      menuItems: roleCards.map((role) => ({
        key: role.id,
        label: role.roleName,
        active: activeSectionKey === 'roles' && selectedRoleId === role.id,
        overflowMenuItems: buildRoleOverflowMenuItems({
          roleId: role.id,
          t,
          isDisabled: duplicateRoleMutation.isPending || deleteRoleMutation.isPending,
          onDuplicate: handleDuplicateRole,
          onDelete: (nextRoleId) => {
            void handleDeleteRole(nextRoleId);
          },
        }),
        onClick: () => {
          openExistingRole(role.id);
        },
      })),
      render: () => {
        if (!roleDraft) return null;

        return (
          <CastingRoleForm
            key={`${selectedRoleId ?? 'none'}-${roleFormRenderKey}`}
            data={roleDraft}
            backendErrors={roleMutation.fieldErrors}
            onChange={(patch) => {
              setRoleDraft((prev) => (prev ? { ...prev, ...patch } : prev));
            }}
            onClearBackendError={roleMutation.clearFieldError}
            onValidityChange={setIsRoleFormValid}
          />
        );
      },
    },
  ];

  const bottomSection = (
    <SectionCard>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap flex-row items-center justify-between font-semibold">
          <p>{t('employer_castings.dashboard.checkout.total')}:</p>
          <h2>{t('employer_castings.dashboard.checkout.beta_total')}</h2>
        </div>
        <Separator className="opacity-20" />
        <Button variant="primary" disabled={!data.publishable} onClick={openCheckoutModal}>
          {t('employer_castings.dashboard.checkout.checkout_and_publish')}
        </Button>
      </div>
    </SectionCard>
  );

  const mobileCheckoutBar = (
    <article className="w-full flex flex-col px-6">
      <div className="flex flex-wrap flex-row items-center justify-between font-semibold">
        <p>{t('employer_castings.dashboard.checkout.total')}:</p>
        <h2>{t('employer_castings.dashboard.checkout.beta_total')}</h2>
      </div>
      <Separator className="opacity-20 my-4" />
      <Button variant="primary" disabled={!data.publishable} onClick={openCheckoutModal}>
        {t('employer_castings.dashboard.checkout.checkout_and_publish')}
      </Button>
    </article>
  );

  return (
    <DashboardShell
      title={t('employer_castings.dashboard.title_edit')}
      sections={sections}
      initialKey="basic"
      activeKey={activeSectionKey}
      onActiveSectionChange={(key) => {
        if (key === 'basic' || key === 'roles') {
          setActiveSectionKey(key);
        }
      }}
      bottomSection={bottomSection}
      mobileNavBottomBar={mobileCheckoutBar}
    />
  );
};

export default EmployerCastingPage;
