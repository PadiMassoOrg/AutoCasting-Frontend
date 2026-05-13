import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { Button, DashboardShell, type OverflowMenuItem } from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { useToast } from '../../../../context/ToastContext';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { ROUTES } from '../../../../shared/lib/routes';
import { handleBackendLocalFieldOrToastError } from '../../../../shared/utils/backendErrorHandling';
import { formatLastSavedDateTime } from '../../../../shared/utils/formatUtils';
import { stableStringify } from '../../../../shared/utils/stableStringify';
import { isCastingEditable } from '../../../sitemetadata/utils/siteMetadataUtils';
import CastingBasicInfoForm from '../components/Form/BasicInfo/CastingBasicInfoForm';
import CastingRoleForm from '../components/Form/Role/CastingRoleForm';
import { useDeleteCastingRoleMutation } from '../hooks/useDeleteCastingRoleMutation';
import { useEmployerCastingEditorBySlug } from '../hooks/useEmployerCastingDetailsBySlug';
import { useUpdateCastingMutation } from '../hooks/useUpdateCastingMutation';
import {
  createCastingRole,
  EMPLOYER_CASTING_EDITOR_CACHE_KEY,
  EMPLOYER_CASTING_ROLE_CACHE_KEY,
  getCastingRoleById,
  updateCastingRole,
} from '../services/employerCastingService';
import type {
  CastingBasicInfoFormData,
  CastingRoleFieldKey,
  CastingRoleFormData,
  CastingRoleResponse,
  EmployerCastingEditorResponse,
} from '../types/employerCastings.types';
import type { CastingRoleRequest, CastingUpsertRequest } from '../types/requests';

const EmployerCastingPage = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useEmployerCastingEditorBySlug(slug);
  const basicInfoMutation = useUpdateCastingMutation(slug);
  const deleteRoleMutation = useDeleteCastingRoleMutation(slug);

  const [activeSectionKey, setActiveSectionKey] = useState<'basic' | 'roles'>('basic');
  const [draft, setDraft] = useState<CastingBasicInfoFormData | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | 'new' | null>(null);
  const [roleDraft, setRoleDraft] = useState<CastingRoleFormData | null>(null);
  const [roleFieldErrors, setRoleFieldErrors] = useState<Partial<Record<CastingRoleFieldKey, string>>>({});
  const [isRoleFormValid, setIsRoleFormValid] = useState(false);
  const [roleFormRenderKey, setRoleFormRenderKey] = useState(0);

  const castingId = data?.id ?? null;

  const selectedRoleQuery = useQuery({
    queryKey:
      selectedRoleId && selectedRoleId !== 'new'
        ? [...EMPLOYER_CASTING_ROLE_CACHE_KEY, selectedRoleId]
        : EMPLOYER_CASTING_ROLE_CACHE_KEY,
    queryFn: () => getCastingRoleById(selectedRoleId as string),
    enabled: !!selectedRoleId && selectedRoleId !== 'new',
  });

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
      await queryClient.invalidateQueries({ queryKey: [...EMPLOYER_CASTING_ROLE_CACHE_KEY, savedRole.id] });
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
        showToast: (message) =>
          showToast({
            title: t('general.error'),
            description: message,
            type: 'danger',
          }),
      });
    },
  });

  useEffect(() => {
    if (!data) return;
    setDraft(toBasicInfoFormData(data));
  }, [data]);

  useEffect(() => {
    if (!castingId || selectedRoleId || !data?.roles.length) return;
    setSelectedRoleId(data.roles[0].id);
  }, [castingId, data?.roles, selectedRoleId]);

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
    const nextSelectedRoleId = selectedRoleId === roleId ? (remainingRoles[0]?.id ?? 'new') : selectedRoleId;

    await deleteRoleMutation.mutateAsync({ roleId });
    setSelectedRoleId(nextSelectedRoleId);
    setRoleFieldErrors({});
    if (selectedRoleId === roleId) {
      setRoleDraft(createEmptyRoleDraft(castingId));
      setRoleFormRenderKey((prev) => prev + 1);
    }

    if (nextSelectedRoleId === 'new') {
      setRoleDraft(createEmptyRoleDraft(castingId));
      setRoleFormRenderKey((prev) => prev + 1);
    }
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
    const sourceRole =
      selectedRoleId === roleId && selectedRoleQuery.data ? selectedRoleQuery.data : await getCastingRoleById(roleId);
    const duplicatedDraft = toDuplicatedRoleFormData(sourceRole);

    setSelectedRoleId('new');
    setRoleDraft(duplicatedDraft);
    setRoleFieldErrors({});
    setIsRoleFormValid(false);
    setRoleFormRenderKey((prev) => prev + 1);
    setActiveSectionKey('roles');
  };

  const getRoleOverflowMenuItems = (roleId: string): OverflowMenuItem[] => [
    {
      key: `duplicate-${roleId}`,
      label: t('general.duplicate'),
      onSelect: () => handleDuplicateRole(roleId),
    },
    {
      key: `delete-${roleId}`,
      label: t('general.delete'),
      iconName: 'delete',
      destructive: true,
      disabled: deleteRoleMutation.isPending,
      onSelect: () => handleDeleteRole(roleId),
    },
  ];

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
        overflowMenuItems: getRoleOverflowMenuItems(role.id),
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

const createEmptyRoleDraft = (castingId: string | null): CastingRoleFormData => ({
  id: null,
  castingId,
  roleName: '',
  roleTypeId: null,
  genderId: null,
  ageMin: '',
  ageMax: '',
  description: '',
  professionIds: [],
  skillIds: [],
  payRateTypeId: null,
  currencyId: null,
  amount: '',
  remunerationNotes: '',
  requiresAudio: false,
  requiresVideo: false,
  requirementDescription: '',
  ethnicityId: null,
  tattoo: null,
  passport: null,
  drivingLicense: null,
});

const toBasicInfoFormData = (data: EmployerCastingEditorResponse): CastingBasicInfoFormData => ({
  title: data.title ?? '',
  projectTypeId: data.projectType?.id ?? null,
  castingModalityId: data.castingModality?.id ?? null,
  locationText: data.locationText ?? '',
  applicationDeadline: data.applicationDeadline ?? '',
  hasWardrobeFitting: data.hasWardrobeFitting ?? null,
  wardrobeFittingText: data.wardrobeFittingText ?? '',
  shootingStartDate: data.shootingStartDate ?? '',
  shootingEndDate: data.shootingEndDate ?? '',
  description: data.description ?? '',
});

const toRoleFormData = (data: CastingRoleResponse): CastingRoleFormData => ({
  id: data.id,
  castingId: data.castingId,
  roleName: data.roleName ?? '',
  roleTypeId: data.roleType?.id ?? null,
  genderId: data.gender?.id ?? null,
  ageMin: data.ageMin != null ? String(data.ageMin) : '',
  ageMax: data.ageMax != null ? String(data.ageMax) : '',
  description: data.description ?? '',
  professionIds: (data.professions ?? []).map((profession) => profession.id),
  skillIds: (data.skills ?? []).map((skill) => skill.id),
  payRateTypeId: data.remuneration?.payRateType?.id ?? null,
  currencyId: data.remuneration?.currency?.id ?? null,
  amount: data.remuneration?.amount != null ? String(data.remuneration.amount) : '',
  remunerationNotes: data.remuneration?.notes ?? '',
  requiresAudio: !!data.requiresAudio,
  requiresVideo: !!data.requiresVideo,
  requirementDescription: data.requirementDescription ?? '',
  ethnicityId: data.ethnicity?.id ?? null,
  tattoo: data.tattoo ?? null,
  passport: data.passport ?? null,
  drivingLicense: data.drivingLicense ?? null,
});

const toDuplicatedRoleFormData = (data: CastingRoleResponse): CastingRoleFormData => ({
  ...toRoleFormData(data),
  id: null,
  roleName: `${data.roleName ?? ''} - COPY`,
});

const toNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const toNullableNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed.length) return null;
  return Number(trimmed);
};

const toCastingUpsertRequest = (draft: CastingBasicInfoFormData): CastingUpsertRequest => ({
  title: draft.title.trim(),
  projectTypeId: draft.projectTypeId ?? null,
  castingModalityId: draft.castingModalityId ?? null,
  locationText: toNullableString(draft.locationText),
  applicationDeadline: draft.applicationDeadline || null,
  hasWardrobeFitting: draft.hasWardrobeFitting,
  wardrobeFittingText: toNullableString(draft.wardrobeFittingText),
  shootingStartDate: draft.shootingStartDate || null,
  shootingEndDate: draft.shootingEndDate || null,
  description: toNullableString(draft.description),
});

const toCastingRoleRequest = (draft: CastingRoleFormData, castingId: string): CastingRoleRequest => ({
  castingId,
  roleName: draft.roleName.trim(),
  roleTypeId: draft.roleTypeId!,
  genderId: draft.genderId!,
  ageMin: Number(draft.ageMin),
  ageMax: Number(draft.ageMax),
  description: toNullableString(draft.description),
  professionIds: draft.professionIds,
  skillIds: draft.skillIds,
  payRateTypeId: draft.payRateTypeId!,
  currencyId: draft.currencyId ?? null,
  amount: toNullableNumber(draft.amount),
  remunerationNotes: toNullableString(draft.remunerationNotes),
  requiresAudio: draft.requiresAudio,
  requiresVideo: draft.requiresVideo,
  requirementDescription: toNullableString(draft.requirementDescription),
  ethnicityId: draft.ethnicityId ?? null,
  tattoo: draft.tattoo,
  passport: draft.passport,
  drivingLicense: draft.drivingLicense,
});

export default EmployerCastingPage;
