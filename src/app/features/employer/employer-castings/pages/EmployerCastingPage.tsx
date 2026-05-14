import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { Button, DashboardShell, type OverflowMenuItem } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { useBackendErrorToast } from '../../../../shared/hooks/useBackendErrorToast';
import { ROUTES } from '../../../../shared/lib/routes';
import { handleBackendLocalFieldOrToastError } from '../../../../shared/utils/backendErrorHandling';
import { formatLastSavedDateTime } from '../../../../shared/utils/formatUtils';
import { stableStringify } from '../../../../shared/utils/stableStringify';
import { isCastingEditable } from '../../../sitemetadata/utils/siteMetadataUtils';
import CastingBasicInfoForm from '../components/Form/BasicInfo/CastingBasicInfoForm';
import CastingRoleForm from '../components/Form/Role/CastingRoleForm';
import { useDeleteCastingRoleMutation } from '../hooks/useDeleteCastingRoleMutation';
import { useDuplicateCastingRoleMutation } from '../hooks/useDuplicateCastingRoleMutation';
import { useCastingRoleById } from '../hooks/useCastingRoleById';
import { useEmployerCastingEditorBySlug } from '../hooks/useEmployerCastingDetailsBySlug';
import { useUpdateCastingMutation } from '../hooks/useUpdateCastingMutation';
import {
  createCastingRole,
  EMPLOYER_CASTING_EDITOR_CACHE_KEY,
  updateCastingRole,
} from '../services/employerCastingService';
import {
  createEmptyRoleDraft,
  toBasicInfoFormData,
  toCastingRoleRequest,
  toCastingUpsertRequest,
  toRoleFormData,
} from '../utils/employerCastingEditorFormMappers';
import type {
  CastingBasicInfoFormData,
  CastingRoleFieldKey,
  CastingRoleFormData,
  CastingRoleResponse,
} from '../types/employerCastings.types';
import type { CastingRoleRequest } from '../types/requests';

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
  const showErrorToast = useBackendErrorToast();
  const queryClient = useQueryClient();
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useEmployerCastingEditorBySlug(slug);
  const basicInfoMutation = useUpdateCastingMutation(slug);
  const deleteRoleMutation = useDeleteCastingRoleMutation(slug);
  const duplicateRoleMutation = useDuplicateCastingRoleMutation(slug);

  const [activeSectionKey, setActiveSectionKey] = useState<'basic' | 'roles'>('basic');
  const [draft, setDraft] = useState<CastingBasicInfoFormData | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | 'new' | null>(null);
  const [roleDraft, setRoleDraft] = useState<CastingRoleFormData | null>(null);
  const [roleFieldErrors, setRoleFieldErrors] = useState<Partial<Record<CastingRoleFieldKey, string>>>({});
  const [isRoleFormValid, setIsRoleFormValid] = useState(false);
  const [roleFormRenderKey, setRoleFormRenderKey] = useState(0);

  const castingId = data?.id ?? null;

  const selectedRoleQuery = useCastingRoleById(selectedRoleId && selectedRoleId !== 'new' ? selectedRoleId : null);

  const roleMutation = useMutation<CastingRoleResponse, unknown, { roleId?: string; payload: CastingRoleRequest }>({
    mutationFn: ({ roleId, payload }) => {
      if (!roleId) return createCastingRole(payload);
      return updateCastingRole({ roleId, payload });
    },
    onMutate: () => {
      setRoleFieldErrors({});
    },
    onSuccess: async (savedRole) => {
      if (slug) {
        await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_EDITOR_CACHE_KEY, slug] });
      }
      setSelectedRoleId('new');
      setRoleDraft(createEmptyRoleDraft(savedRole.castingId));
      setIsRoleFormValid(false);
      setRoleFormRenderKey((prev) => prev + 1);
    },
    onError: (error) => {
      handleBackendLocalFieldOrToastError<CastingRoleFieldKey>({
        error,
        t,
        setFieldError: (field, message) => {
          setRoleFieldErrors((prev) => {
            const next = { ...prev };
            if (!message) delete next[field];
            else next[field] = message;
            return next;
          });
        },
        showToast: showErrorToast,
      });
    },
  });

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

    setRoleFieldErrors({});
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
    await roleMutation.mutateAsync({
      roleId: roleDraft.id ?? undefined,
      payload: toCastingRoleRequest(roleDraft, castingId),
    });
  };

  const handleDuplicateRole = async (roleId: string) => {
    const duplicatedRole = await duplicateRoleMutation.mutateAsync({ roleId });

    setSelectedRoleId(duplicatedRole.id);
    setRoleDraft(toRoleFormData(duplicatedRole));
    setRoleFieldErrors({});
    setIsRoleFormValid(false);
    setRoleFormRenderKey((prev) => prev + 1);
    setActiveSectionKey('roles');
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
        setRoleFieldErrors({});
        setIsRoleFormValid(false);
        setRoleFormRenderKey((prev) => prev + 1);
      },
      sectionTitle: t('employer_castings.dashboard.roles.roles'),
      sectionActions: (
        <Button variant="primary" onClick={handleRoleSave} disabled={!canSaveRole} loading={roleMutation.isPending}>
          {t('general.save_changes')}
        </Button>
      ),
      menuAction: {
        label: t('employer_castings.dashboard.roles.add_new'),
        active: activeSectionKey === 'roles' && selectedRoleId === 'new',
        onClick: () => {
          setSelectedRoleId('new');
          setRoleDraft(createEmptyRoleDraft(castingId));
          setRoleFieldErrors({});
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
          setRoleFieldErrors({});
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
            backendErrors={roleFieldErrors}
            onChange={(patch) => {
              setRoleDraft((prev) => (prev ? { ...prev, ...patch } : prev));
            }}
            onClearBackendError={(field) => {
              setRoleFieldErrors((prev) => {
                if (!(field in prev)) return prev;
                const next = { ...prev };
                delete next[field];
                return next;
              });
            }}
            onValidityChange={setIsRoleFormValid}
          />
        );
      },
    },
  ];

  const titleActions = (
    <Button
      variant="primary"
      onClick={handleBasicInfoSave}
      disabled={!hasTitle || !isDirty}
      loading={basicInfoMutation.isPending}
    >
      {t('general.save_changes')}
    </Button>
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
      bottomSection={
        data ? (
          <div className="text-sm text-(--color-secondary-gray)">
            <p>{t('general.datetime.last_saved')}:</p>
            <p>{formatLastSavedDateTime(data.modifiedAt, t)}</p>
          </div>
        ) : undefined
      }
    />
  );
};

export default EmployerCastingPage;
