import { zodResolver } from '@hookform/resolvers/zod';
import {
  BooleanRadioGroup,
  Button,
  CheckboxField,
  FormCurrencyField,
  FormInputField,
  FormSelectField,
  Icon,
  Label,
  MultiSelectDropdown,
  Separator,
  TextareaField,
  UploadTile,
  useMedia,
  XL_SCREEN_SIZE,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useForm, useWatch, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMultiSelectLabels } from '../../../../../../shared/hooks/useMultiSelectLabels';
import { useModal } from '../../../../../../context/ModalContext';
import { useCastingRolePhotoUpload } from '../../../../../../integrations/supabase/media/hooks/useCastingRolePhotoUpload';
import { removeByPublicUrl } from '../../../../../../integrations/supabase/media/lib/profile-media';
import { getBackendErrorMessage } from '../../../../../../shared/utils/backendErrorHandling';
import {
  useCachedSiteMetadataOption,
  useCachedSiteMetadataSlice,
} from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import {
  CURRENCY_ARS,
  GENDER_INDISTINCT,
  getRoleRemunerationVisiblePayRateTypeOptions,
  getSiteMetadataIdByStringCode,
  isUnpaidLikePayRateType,
  PAY_RATE_TYPE_UNPAID,
} from '../../../../../sitemetadata/utils/siteMetadataUtils';
import GroupedSkills from '../../../../../talent/talent-profile-edit/components/Form/Skills/GroupedSkills';
import { NewSkillModal } from '../../../../../talent/talent-profile-edit/components/Form/Skills/NewSkillModal';
import { getCastingRoleSchema } from '../../../schemas/castingRoleSchema';
import type { CastingRoleFieldKey, CastingRoleFormData } from '../../../types/employerCastings.types';

/**
 * Uploads a pending reference-photo selection (if any) and/or deletes an old one that was
 * replaced/removed, returning the URL that should be persisted on the role (null if there is
 * none). Registered with the parent so it can be awaited right before the role save request is
 * built — see CastingRoleForm's commitPendingReferencePhoto and EmployerCastingPage's
 * handleRoleSave.
 */
export type CommitReferencePhoto = () => Promise<string | null>;

type Props = {
  data: CastingRoleFormData;
  employerProfileId: string;
  backendErrors?: Partial<Record<CastingRoleFieldKey, string>>;
  onChange: (patch: Partial<CastingRoleFormData>) => void;
  onClearBackendError?: (field: CastingRoleFieldKey) => void;
  onValidityChange?: (isValid: boolean) => void;
  onRegisterCommitReferencePhoto?: (commit: CommitReferencePhoto) => void;
  onPendingReferencePhotoDirtyChange?: (isDirty: boolean) => void;
};

const CastingRoleForm = ({
  data,
  employerProfileId,
  backendErrors,
  onChange,
  onClearBackendError,
  onValidityChange,
  onRegisterCommitReferencePhoto,
  onPendingReferencePhotoDirtyChange,
}: Props) => {
  const { t } = useTranslation();
  const multiSelectLabels = useMultiSelectLabels();
  const { openModal, closeModal } = useModal();
  const isXLSize = useMedia(XL_SCREEN_SIZE);
  const { mutateAsync: uploadReferencePhoto, isPending: referencePhotoUploadPending } = useCastingRolePhotoUpload(
    employerProfileId,
    data.castingId ?? ''
  );
  const [referencePhotoPreviewUrl, setReferencePhotoPreviewUrl] = useState<string | null>(null);
  const [referencePhotoError, setReferencePhotoError] = useState<string | null>(null);
  // Reference photo is never uploaded/deleted on selection — only committed (uploaded and/or
  // the previous file removed) once the role is actually saved, so an abandoned draft never
  // leaves an orphaned file in Supabase. See commitPendingReferencePhoto below. Because the
  // pending change lives here (not in the roleDraft the parent diffs against its initial
  // snapshot), it's reported separately via onPendingReferencePhotoDirtyChange so the parent's
  // save button reacts to it too.
  const pendingFileRef = useRef<File | null>(null);
  const pendingRemovalRef = useRef(false);
  const persistedUrlRef = useRef<string | null>(data.referencePhotoUrl ?? null);
  const [isReferencePhotoDirty, setIsReferencePhotoDirty] = useState(false);

  // Resets all pending-photo state on a real role switch (data.id change) — the form remounts
  // for this anyway (parent uses a role-keyed `key`), but keeping this explicit avoids relying
  // on remount timing alone.
  useEffect(() => {
    pendingFileRef.current = null;
    pendingRemovalRef.current = false;
    persistedUrlRef.current = data.referencePhotoUrl ?? null;
    setIsReferencePhotoDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id]);

  // Re-syncs persistedUrlRef when the same role's data prop refreshes without a role switch
  // (e.g. useCastingRoleById's background refetch on mount resolving after the initial
  // render) — but only while nothing is pending, so a refetch resolving mid-interaction never
  // silently clobbers an in-progress pick/delete and re-disables the save button.
  useEffect(() => {
    const hasPendingChange = pendingFileRef.current != null || pendingRemovalRef.current;
    if (hasPendingChange) return;
    persistedUrlRef.current = data.referencePhotoUrl ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.referencePhotoUrl]);

  useEffect(() => {
    onPendingReferencePhotoDirtyChange?.(isReferencePhotoDirty);
  }, [isReferencePhotoDirty, onPendingReferencePhotoDirtyChange]);

  const commitPendingReferencePhoto: CommitReferencePhoto = async () => {
    const file = pendingFileRef.current;
    const removed = pendingRemovalRef.current;
    const previousUrl = persistedUrlRef.current;

    if (!file && !removed) return previousUrl;

    setReferencePhotoError(null);

    if (file) {
      let publicUrl: string;
      try {
        publicUrl = await uploadReferencePhoto({ file });
      } catch (err: unknown) {
        setReferencePhotoError(getBackendErrorMessage(err, t));
        throw err;
      }
      if (previousUrl) {
        await removeByPublicUrl(previousUrl).catch((e) => {
          console.error('Error removing previous casting role reference photo', e);
        });
      }
      pendingFileRef.current = null;
      pendingRemovalRef.current = false;
      persistedUrlRef.current = publicUrl;
      setIsReferencePhotoDirty(false);
      return publicUrl;
    }

    if (previousUrl) {
      await removeByPublicUrl(previousUrl).catch((e) => {
        console.error('Error removing casting role reference photo', e);
      });
    }
    pendingRemovalRef.current = false;
    persistedUrlRef.current = null;
    setIsReferencePhotoDirty(false);
    return null;
  };

  useEffect(() => {
    onRegisterCommitReferencePhoto?.(commitPendingReferencePhoto);
  });

  const roleTypeOptions = useCachedSiteMetadataOption('roleTypeOptions', t);
  const genderOptions = useCachedSiteMetadataOption('genderOptions', t);
  const payRateTypeOptionsRaw = (useCachedSiteMetadataOption('payRateTypeOptions', t, undefined, { raw: true }) ??
    []) as SiteMetadataObject[];
  const payRateTypeOptions = useMemo(
    () =>
      getRoleRemunerationVisiblePayRateTypeOptions(payRateTypeOptionsRaw).map((option) => ({
        value: option.id,
        label: t(option.stringCode),
      })),
    [payRateTypeOptionsRaw, t]
  );
  const currencyOptions = useCachedSiteMetadataOption('currencyOptions', t);
  const genderOptionsRaw = (useCachedSiteMetadataSlice('genderOptions') as SiteMetadataObject[] | undefined) ?? [];
  const currencyOptionsRaw = (useCachedSiteMetadataSlice('currencyOptions') as SiteMetadataObject[] | undefined) ?? [];
  const ethnicityOptions = useCachedSiteMetadataOption('ethnicityOptions', t);
  const professionsRaw = (useCachedSiteMetadataSlice('professions') as SiteMetadataObject[] | undefined) ?? [];
  const allSkills = (useCachedSiteMetadataSlice('skills') as SiteMetadataObject[] | undefined) ?? [];
  const schema = useMemo(() => getCastingRoleSchema(t, payRateTypeOptionsRaw), [t, payRateTypeOptionsRaw]);
  const {
    control,
    reset,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<CastingRoleFormData>({
    resolver: zodResolver(schema) as never,
    mode: 'onChange',
    defaultValues: data,
  });
  const formValues = useWatch({ control }) as CastingRoleFormData;

  useEffect(() => {
    reset(data);
    // react-hook-form doesn't compute formState.isValid until the first validation run (a
    // field change/blur, or this explicit trigger). For an existing, already-saved role that
    // is presumably still valid, that leaves isValid: false until some field is touched —
    // which blocks saving a role where only the reference photo changed, since that field
    // isn't managed by react-hook-form at all. Only do this for an existing role (data.id set)
    // — a brand-new draft is empty by definition and must not be eagerly validated/show errors
    // before the user has touched anything.
    if (data.id) void trigger();
  }, [data.id, reset, trigger]);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const selectedSkills = useMemo(
    () => allSkills.filter((skill) => (formValues?.skillIds ?? []).includes(skill.id)),
    [allSkills, formValues?.skillIds]
  );
  const defaultPayRateTypeId = useMemo(
    () => getSiteMetadataIdByStringCode(payRateTypeOptionsRaw, PAY_RATE_TYPE_UNPAID),
    [payRateTypeOptionsRaw]
  );
  const defaultCurrencyId = useMemo(
    () => getSiteMetadataIdByStringCode(currencyOptionsRaw, CURRENCY_ARS),
    [currencyOptionsRaw]
  );
  const defaultGenderId = useMemo(
    () => getSiteMetadataIdByStringCode(genderOptionsRaw, GENDER_INDISTINCT),
    [genderOptionsRaw]
  );
  const isUnpaidPayRate = isUnpaidLikePayRateType(formValues?.payRateTypeId, payRateTypeOptionsRaw);

  useEffect(() => {
    const patch = getRoleFormDefaultsPatch({
      payRateTypeId: formValues?.payRateTypeId,
      currencyId: formValues?.currencyId,
      genderId: formValues?.genderId,
      defaultPayRateTypeId,
      defaultCurrencyId,
      defaultGenderId,
    });

    const entries = Object.entries(patch) as Array<
      [keyof CastingRoleFormData, CastingRoleFormData[keyof CastingRoleFormData]]
    >;
    if (!entries.length) return;

    entries.forEach(([field, value]) => {
      setValue(field as Path<CastingRoleFormData>, value as never, {
        shouldDirty: false,
        shouldValidate: true,
        shouldTouch: false,
      });
    });

    onChange(patch);
  }, [
    defaultCurrencyId,
    defaultGenderId,
    defaultPayRateTypeId,
    formValues?.currencyId,
    formValues?.genderId,
    formValues?.payRateTypeId,
    onChange,
    setValue,
  ]);

  const resolveError = (field: CastingRoleFieldKey) => {
    const local = errors[field];
    return (local?.message as string | undefined) ?? backendErrors?.[field];
  };

  const clearBackend = (field: CastingRoleFieldKey) => {
    onClearBackendError?.(field);
  };

  const handlePayRateTypeChange = (next: string | null) => {
    if (isUnpaidLikePayRateType(next, payRateTypeOptionsRaw)) {
      setValue('payRateTypeId', next as never, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
      setValue('amount', '' as never, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
      onChange({
        payRateTypeId: next,
        amount: '',
      });
      clearBackend('payRateTypeId');
      clearBackend('amount');
      return;
    }

    updateField('payRateTypeId', next, 'payRateTypeId');
  };

  const updateField = <K extends keyof CastingRoleFormData>(
    field: K,
    value: CastingRoleFormData[K],
    clearBackendField?: CastingRoleFieldKey
  ) => {
    setValue(field as Path<CastingRoleFormData>, value as never, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    onChange({ [field]: value } as Partial<CastingRoleFormData>);
    if (clearBackendField) clearBackend(clearBackendField);
  };

  // Reference photo is uploaded to Supabase only when the role is actually saved (see
  // commitPendingReferencePhoto, called by the parent from handleRoleSave) — not on file
  // select. Picking a photo on a brand-new role draft that never gets saved must never leave
  // an orphaned file in Supabase, so selection only stores the raw File locally and shows a
  // client-side preview until save time.
  const handleSelectReferencePhoto = async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    setReferencePhotoError(null);
    const localUrl = await fileToDataUrl(file);
    setReferencePhotoPreviewUrl(localUrl);
    pendingFileRef.current = file;
    pendingRemovalRef.current = false;
    // Always a real change from baseline — a newly picked file is never equal to whatever
    // was (or wasn't) persisted.
    setIsReferencePhotoDirty(true);
  };

  const handleDeleteReferencePhoto = () => {
    setReferencePhotoPreviewUrl(null);
    setReferencePhotoError(null);
    updateField('referencePhotoUrl', null);
    pendingFileRef.current = null;
    pendingRemovalRef.current = true;
    // Only a real change if there was actually a persisted photo to remove — e.g. pick a
    // photo then delete it before saving nets back to the original (no-photo) baseline, and
    // the save button must not think anything changed.
    setIsReferencePhotoDirty(persistedUrlRef.current != null);
  };

  const openSkillsModal = () => {
    openModal(
      <NewSkillModal
        initial={selectedSkills}
        onCancel={closeModal}
        onSave={(nextIds) => {
          updateField('skillIds', nextIds);
          closeModal();
        }}
      />,
      t('profile.skills.skills'),
      'lg'
    );
  };

  return (
    <article className="flex flex-col">
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-x-4">
        <FormInputField
          id="roleName"
          label={t('employer_castings.dashboard.roles.role.role_name')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.role_name')}
          value={formValues?.roleName ?? ''}
          onChange={(e) => {
            const next = e.target.value;
            updateField('roleName', next, 'roleName');
          }}
          error={resolveError('roleName')}
          required
        />

        <FormSelectField
          id="roleTypeId"
          label={t('casting-database.filter.role_type')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.select')}
          value={formValues?.roleTypeId ?? ''}
          onChange={(e) => {
            const next = e.target.value || null;
            updateField('roleTypeId', next, 'roleTypeId');
          }}
          options={roleTypeOptions}
          error={resolveError('roleTypeId')}
          required
        />

        <article className="w-full flex flex-col">
          <div className="mb-1 flex">
            <Label className="text-base font-semibold">
              {t('employer_castings.dashboard.roles.role.talent_profession')}
            </Label>
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          </div>
          <MultiSelectDropdown
            {...multiSelectLabels}
            options={professionsRaw}
            getId={(profession: SiteMetadataObject) => profession.id}
            getLabel={(profession: SiteMetadataObject) => t(profession.stringCode)}
            selected={formValues?.professionIds ?? []}
            onChange={(next: string[]) => {
              updateField('professionIds', next, 'professionIds');
            }}
            maxPanelHeight="16rem"
            error={resolveError('professionIds')}
          />
        </article>

        <FormSelectField
          id="genderId"
          label={t('profile.basic_info.gender')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.select')}
          value={formValues?.genderId ?? ''}
          onChange={(e) => {
            const next = e.target.value || null;
            updateField('genderId', next, 'genderId');
          }}
          options={genderOptions}
          error={resolveError('genderId')}
          required
        />

        <article className="flex flex-col">
          <div className="mb-1 flex">
            <Label className="text-base font-semibold">{t('talent.filter.basic_info.age_range')}</Label>
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInputField
              id="ageMin"
              placeholder={t('general.placeholder.min')}
              value={formValues?.ageMin ?? ''}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 2);
                updateField('ageMin', next, 'ageMin');
              }}
              error={resolveError('ageMin')}
            />
            <FormInputField
              id="ageMax"
              placeholder={t('general.placeholder.max')}
              value={formValues?.ageMax ?? ''}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 2);
                updateField('ageMax', next, 'ageMax');
              }}
              error={resolveError('ageMax')}
            />
          </div>
        </article>

        <FormSelectField
          id="ethnicityId"
          label={t('profile.characteristics.ethnicity')}
          labelClassName="font-semibold text-base"
          placeholder={t('general.placeholder.select')}
          value={formValues?.ethnicityId ?? ''}
          onChange={(e) => {
            const next = e.target.value || null;
            updateField('ethnicityId', next);
          }}
          options={ethnicityOptions}
        />
      </section>

      <Separator className="opacity-20 mt-2 mb-8" />

      <section className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-x-4">
        <article className="flex flex-col">
          <FormSelectField
            id="payRateTypeId"
            label={t('employer_castings.dashboard.remunerations.remuneration.pay_rate_type_label')}
            labelClassName="font-semibold text-base"
            placeholder={t('general.placeholder.select')}
            value={formValues?.payRateTypeId ?? ''}
            onChange={(e) => {
              const next = e.target.value || null;
              handlePayRateTypeChange(next);
            }}
            options={payRateTypeOptions}
            error={resolveError('payRateTypeId')}
            required
          />

          <article className="flex flex-col">
            <div className="mb-2 flex">
              <Label className="text-base font-semibold">
                {t('employer_castings.dashboard.remunerations.remuneration.amount_label')}
              </Label>
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-end">
              <FormSelectField
                id="currencyId"
                placeholder={t('general.placeholder.select')}
                value={formValues?.currencyId ?? ''}
                disabled={isUnpaidPayRate}
                onChange={(e) => {
                  const next = e.target.value || null;
                  updateField('currencyId', next);
                }}
                options={currencyOptions}
              />

              <FormCurrencyField
                id="amount"
                placeholder="0"
                value={formValues?.amount ?? ''}
                disabled={isUnpaidPayRate}
                onValueChange={(_, rawDigits) => {
                  updateField('amount', rawDigits, 'amount');
                }}
                error={resolveError('amount')}
              />
            </div>
          </article>
        </article>

        <article className="flex flex-col">
          <div className="mb-2">
            <Label className="text-base font-semibold">{t('employer_castings.dashboard.requirements.edit')}</Label>
          </div>

          <div className="mb-2 flex flex-wrap gap-x-6 gap-y-3">
            <CheckboxFieldLike
              id="requiresVideo"
              label={t('employer_castings.dashboard.requirements.requirement.video_true')}
              checked={!!formValues?.requiresVideo}
              onCheckedChange={(checked) => updateField('requiresVideo', checked)}
            />
            <CheckboxFieldLike
              id="requiresAudio"
              label={t('employer_castings.dashboard.requirements.requirement.audio_true')}
              checked={!!formValues?.requiresAudio}
              onCheckedChange={(checked) => updateField('requiresAudio', checked)}
            />
          </div>

          <TextareaField
            id="requirementDescription"
            placeholder={t('general.placeholder.about')}
            value={formValues?.requirementDescription ?? ''}
            maxLength={3000}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const next = e.target.value;
              updateField('requirementDescription', next);
            }}
            error={resolveError('requirementDescription')}
            onBlur={() => {}}
            onKeyDown={() => {}}
            minHeightClassName="h-[120px]"
          />
        </article>
      </section>

      <Separator className="opacity-20 my-8" />

      <article className="w-[95%] m-auto flex flex-col lg:flex-row justify-between">
        <BooleanRadioGroup
          name="tattoo"
          orientation={isXLSize ? 'horizontal' : 'vertical'}
          label={t('profile.characteristics.tattoo')}
          value={formValues?.tattoo ?? null}
          includeAnyOption
          anyValueMode="null"
          anyOptionLabel={t('general.indistinct')}
          onChange={(next: boolean | null | undefined) => updateField('tattoo', next ?? null)}
        />
        <BooleanRadioGroup
          name="passport"
          orientation={isXLSize ? 'horizontal' : 'vertical'}
          label={t('profile.characteristics.passport')}
          value={formValues?.passport ?? null}
          includeAnyOption
          anyValueMode="null"
          anyOptionLabel={t('general.indistinct')}
          onChange={(next: boolean | null | undefined) => updateField('passport', next ?? null)}
        />
        <BooleanRadioGroup
          name="drivingLicense"
          orientation={isXLSize ? 'horizontal' : 'vertical'}
          label={t('profile.characteristics.drivingLicense')}
          value={formValues?.drivingLicense ?? null}
          includeAnyOption
          anyValueMode="null"
          anyOptionLabel={t('general.indistinct')}
          onChange={(next: boolean | null | undefined) => updateField('drivingLicense', next ?? null)}
        />
      </article>

      <Separator className="opacity-20 mt-2 mb-8" />

      <section className="w-full flex flex-col lg:flex-row lg:items-center gap-8">
        <article className="w-full flex flex-col gap-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-4">
            <Label className="text-base font-semibold">{t('profile.skills.skills')}</Label>
            <Button type="button" variant="primaryOutline" className="!w-auto" onClick={openSkillsModal}>
              <span className="flex flex-row gap-2">
                <Icon name="plus" size={16} variant="primary" /> {t('profile.skills.add_new_placeholder')}
              </span>
            </Button>
          </div>

          <div className="h-100 lg:h-75 overflow-y-auto rounded-2xl border border-(--color-secondary-outline) p-4">
            <GroupedSkills
              skills={selectedSkills}
              onRemove={(skillId) => {
                updateField(
                  'skillIds',
                  (formValues?.skillIds ?? []).filter((currentId) => currentId !== skillId)
                );
              }}
            />
          </div>
        </article>

        <article className="flex flex-col gap-2">
          <Label className="text-base font-semibold">
            {t('employer_castings.dashboard.roles.role.reference_photo')}
          </Label>
          <div className="min-w-[240px] max-w-[240px] aspect-[3/4]">
            <UploadTile
              value={formValues?.referencePhotoUrl ?? undefined}
              previewUrl={referencePhotoPreviewUrl}
              onSelect={handleSelectReferencePhoto}
              onDeleteClick={handleDeleteReferencePhoto}
              disabled={referencePhotoUploadPending}
              busy={referencePhotoUploadPending}
              busyText={t('state.loading')}
              accept="image/*,.heic,.heif"
              maxSizeMB={8}
              objectFit="cover"
              multiple={false}
              openOnClick={!referencePhotoUploadPending}
              className="w-full h-full"
            />
          </div>
          {referencePhotoError ? <span className="text-sm text-red-600">{referencePhotoError}</span> : null}
        </article>
      </section>
    </article>
  );
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getRoleFormDefaultsPatch = ({
  payRateTypeId,
  currencyId,
  genderId,
  defaultPayRateTypeId,
  defaultCurrencyId,
  defaultGenderId,
}: {
  payRateTypeId: string | null | undefined;
  currencyId: string | null | undefined;
  genderId: string | null | undefined;
  defaultPayRateTypeId: string | null;
  defaultCurrencyId: string | null;
  defaultGenderId: string | null;
}): Partial<CastingRoleFormData> => {
  const patch: Partial<CastingRoleFormData> = {};

  if (!payRateTypeId && defaultPayRateTypeId) patch.payRateTypeId = defaultPayRateTypeId;
  if (!currencyId && defaultCurrencyId) patch.currencyId = defaultCurrencyId;
  if (!genderId && defaultGenderId) patch.genderId = defaultGenderId;

  return patch;
};

function CheckboxFieldLike({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <CheckboxField
      id={id}
      label={label}
      checked={checked}
      onCheckedChange={onCheckedChange}
      labelClassName="text-base"
    />
  );
}

export default CastingRoleForm;
