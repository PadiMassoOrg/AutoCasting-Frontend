import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import {
  Button,
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

  useEffect(() => {
    if (!data) return;
    setDraft(toBasicInfoFormData(data));
  }, [data]);

  useEffect(() => {
    if (selectedRoleId !== 'new') return;
    setRoleDraft(createEmptyRoleDraft(castingId));
  }, [castingId, selectedRoleId]);

  useEffect(() => {
    if (!selectedRoleQuery.data) return;
    setRoleDraft(toRoleFormData(selectedRoleQuery.data));
  }, [selectedRoleQuery.data]);

  const currentRoleInitialDraft = useMemo(() => {
    if (selectedRoleId === 'new') return createEmptyRoleDraft(castingId);
    if (selectedRoleQuery.data) return toRoleFormData(selectedRoleQuery.data);
    return null;
  }, [castingId, selectedRoleId, selectedRoleQuery.data]);

  if (error && !data) return <ServerError />;
  if (isLoading || !draft || !data) return null;

  if (!isCastingEditable(data.castingStatus)) {
    return <Navigate to={ROUTES.EMPLOYER_CASTINGS} replace />;
  }

  const initialDraft = toBasicInfoFormData(data);
  const isDirty = stableStringify(draft) !== stableStringify(initialDraft);
  const hasTitle = draft.title.trim().length > 0;
  const isRoleDirty =
    !!roleDraft && !!currentRoleInitialDraft && stableStringify(roleDraft) !== stableStringify(currentRoleInitialDraft);
  const canSaveRole = Boolean(roleDraft && castingId && isRoleFormValid && isRoleDirty);

  const roleCards = data?.roles ?? [];

  const handleDeleteRole = async (roleId: string) => {
    const remainingRoles = roleCards.filter((role) => role.id !== roleId);
    const isDeletingSelectedRole = selectedRoleId === roleId;
    const nextSelectedRoleId = isDeletingSelectedRole ? (remainingRoles[0]?.id ?? 'new') : selectedRoleId;

    roleMutation.clearAllBackendErrors();
    setSelectedRoleId(nextSelectedRoleId);
    if (isDeletingSelectedRole && nextSelectedRoleId === 'new') {
      setRoleDraft(createEmptyRoleDraft(castingId));
      setIsRoleFormValid(false);
      setRoleFormRenderKey((prev) => prev + 1);
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
    setSelectedRoleId('new');
    setRoleDraft(createEmptyRoleDraft(savedRole.castingId));
    setIsRoleFormValid(false);
    setRoleFormRenderKey((prev) => prev + 1);
  };

  const handleDuplicateRole = async (roleId: string) => {
    const duplicatedRole = await duplicateRoleMutation.mutateAsync({ roleId });

    setSelectedRoleId(duplicatedRole.id);
    setRoleDraft(toRoleFormData(duplicatedRole));
    roleMutation.clearAllBackendErrors();
    setIsRoleFormValid(false);
    setRoleFormRenderKey((prev) => prev + 1);
    setActiveSectionKey('roles');
  };

  const openCheckoutModal = () => {
    openModal(
      <CastingCheckoutModal data={data} />,
      t('employer_castings.dashboard.checkout.checkout_summary.title'),
      'xl_3'
    );
  };

  const sections: DashboardShellSection<'basic' | 'roles'>[] = [
    {
      key: 'basic',
      label: t('employer_castings.dashboard.basic_info.basic_info'),
      sectionTitle: t('employer_castings.dashboard.basic_info.basic_info'),
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
      onSelect: () => {
        setSelectedRoleId('new');
        setRoleDraft(createEmptyRoleDraft(castingId));
        roleMutation.clearAllBackendErrors();
        setIsRoleFormValid(false);
        setRoleFormRenderKey((prev) => prev + 1);
      },
      sectionTitle: t('employer_castings.dashboard.roles.roles'),
      sectionActions: (
        <Button variant="primary" onClick={handleRoleSave} disabled={!canSaveRole} loading={roleMutation.isPending}>
          {t('employer_castings.dashboard.roles.save_role')}
        </Button>
      ),
      menuAction: {
        label: t('employer_castings.dashboard.roles.add_new'),
        active: activeSectionKey === 'roles' && selectedRoleId === 'new',
        onClick: () => {
          setSelectedRoleId('new');
          setRoleDraft(createEmptyRoleDraft(castingId));
          roleMutation.clearAllBackendErrors();
          setIsRoleFormValid(false);
          setRoleFormRenderKey((prev) => prev + 1);
          setActiveSectionKey('roles');
        },
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
          setSelectedRoleId(role.id);
          roleMutation.clearAllBackendErrors();
          setIsRoleFormValid(false);
          setRoleFormRenderKey((prev) => prev + 1);
          setActiveSectionKey('roles');
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

  const titleActions = (
    <Button
      variant="primaryOutline"
      onClick={handleBasicInfoSave}
      disabled={!hasTitle || !isDirty}
      loading={basicInfoMutation.isPending}
    >
      {t('general.save_unpublished')}
    </Button>
  );

  const bottomSection = (
    <SectionCard>
      <div className="flex flex-wrap flex-row items-center justify-between font-semibold">
        <p>{t('employer_castings.dashboard.checkout.total')}:</p>
        <h2>{t('employer_castings.dashboard.checkout.beta_total')}</h2>
      </div>
      <Separator className="opacity-20 my-4" />
      <Button variant="primary" disabled={!data.publishable} onClick={openCheckoutModal}>
        {t('employer_castings.dashboard.checkout.checkout_and_publish')}
      </Button>
    </SectionCard>
  );

  return (
    <DashboardShell
      title={t('employer_castings.dashboard.title_edit')}
      titleActions={titleActions}
      sections={sections}
      initialKey="basic"
      activeKey={activeSectionKey}
      onActiveSectionChange={(key) => {
        if (key === 'basic' || key === 'roles') {
          setActiveSectionKey(key);
        }
      }}
      bottomSection={bottomSection}
    />
  );
};

export default EmployerCastingPage;
