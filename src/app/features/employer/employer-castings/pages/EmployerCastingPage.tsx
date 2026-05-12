import type { DashboardShellSection } from 'autocasting-ui-library-padimasso';
import { Button, DashboardShell } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ServerError from '../../../../shared/components/ServerError/ServerError';
import { ROUTES } from '../../../../shared/lib/routes';
import { formatLastSavedDateTime } from '../../../../shared/utils/formatUtils';
import { stableStringify } from '../../../../shared/utils/stableStringify';
import { isCastingEditable } from '../../../sitemetadata/utils/siteMetadataUtils';
import CastingBasicInfoForm from '../components/Form/BasicInfo/CastingBasicInfoForm';
import { useEmployerCastingDetailsBySlug } from '../hooks/useEmployerCastingDetailsBySlug';
import { useUpdateCastingMutation } from '../hooks/useUpdateCastingMutation';
import type { CastingBasicInfoFormData, EmployerCastingDetailsResponse } from '../types/employerCastings.types';
import type { CastingUpsertRequest } from '../types/requests';

const EmployerCastingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isCreateMode = !slug || slug === 'new';
  const { data, isLoading, error } = useEmployerCastingDetailsBySlug(isCreateMode ? undefined : slug);
  const saveMutation = useUpdateCastingMutation(slug);

  const [draft, setDraft] = useState<CastingBasicInfoFormData | null>(null);

  useEffect(() => {
    if (isCreateMode) {
      setDraft(createEmptyDraft());
      return;
    }

    if (!data) return;
    setDraft(toBasicInfoFormData(data));
  }, [data, isCreateMode]);

  if (error && !data) return <ServerError />;
  if (isLoading || !draft || (!isCreateMode && !data)) return null;

  if (!isCreateMode && data && !isCastingEditable(data.castingStatus)) {
    return <Navigate to={ROUTES.EMPLOYER_CASTINGS} replace />;
  }

  const initialDraft = isCreateMode ? createEmptyDraft() : toBasicInfoFormData(data!);
  const isDirty = stableStringify(draft) !== stableStringify(initialDraft);
  const hasTitle = draft.title.trim().length > 0;

  const sections: DashboardShellSection[] = [
    {
      key: 'basic',
      label: t('employer_castings.dashboard.basic_info.basic_info'),
      sectionTitle: t('employer_castings.dashboard.basic_info.basic_info'),
      render: () => (
        <CastingBasicInfoForm
          data={draft}
          backendErrors={saveMutation.fieldErrors}
          onChange={(patch) => {
            setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
          }}
          onClearBackendError={saveMutation.clearFieldError}
        />
      ),
    },
  ];

  const handleSave = async () => {
    const payload = toCastingUpsertRequest(draft);
    const saved = await saveMutation.submit(payload, data?.id);

    if (isCreateMode) {
      navigate(`${ROUTES.EMPLOYER_CASTING}/${saved.defaultCode}/editor`, { replace: true });
    }
  };

  const titleActions = (
    <Button variant="primary" onClick={handleSave} disabled={!hasTitle || !isDirty} loading={saveMutation.isPending}>
      {t('general.save_changes')}
    </Button>
  );

  return (
    <DashboardShell
      title={t('employer_castings.dashboard.title_edit')}
      titleActions={titleActions}
      sections={sections}
      initialKey="basic"
      bottomSection={
        !isCreateMode && data ? (
          <div className="text-sm text-(--color-secondary-gray)">
            <p>{t('general.datetime.last_saved')}:</p>
            <p>{formatLastSavedDateTime(data.modifiedAt, t)}</p>
          </div>
        ) : undefined
      }
    />
  );
};

const createEmptyDraft = (): CastingBasicInfoFormData => ({
  title: '',
  projectTypeId: null,
  castingModalityId: null,
  locationText: '',
  applicationDeadline: '',
  hasWardrobeFitting: null,
  wardrobeFittingText: '',
  shootingStartDate: '',
  shootingEndDate: '',
  description: '',
});

const toBasicInfoFormData = (data: EmployerCastingDetailsResponse): CastingBasicInfoFormData => ({
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

const toNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
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

export default EmployerCastingPage;
