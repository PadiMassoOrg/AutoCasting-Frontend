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
  useMedia,
  XL_SCREEN_SIZE,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, type ChangeEvent } from 'react';
import { useForm, useWatch, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../context/ModalContext';
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
  getSiteMetadataStringCodeById,
  isUnpaidPayRateType,
  PAY_RATE_TYPE_UNPAID,
} from '../../../../../sitemetadata/utils/siteMetadataUtils';
import GroupedSkills from '../../../../../talent/talent-profile-edit/components/Form/Skills/GroupedSkills';
import { NewSkillModal } from '../../../../../talent/talent-profile-edit/components/Form/Skills/NewSkillModal';
import { getCastingRoleSchema } from '../../../schemas/castingRoleSchema';
import type { CastingRoleFieldKey, CastingRoleFormData } from '../../../types/employerCastings.types';

type Props = {
  data: CastingRoleFormData;
  backendErrors?: Partial<Record<CastingRoleFieldKey, string>>;
  onChange: (patch: Partial<CastingRoleFormData>) => void;
  onClearBackendError?: (field: CastingRoleFieldKey) => void;
  onValidityChange?: (isValid: boolean) => void;
};

const CastingRoleForm = ({ data, backendErrors, onChange, onClearBackendError, onValidityChange }: Props) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const isXLSize = useMedia(XL_SCREEN_SIZE);

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
    formState: { errors, isValid },
  } = useForm<CastingRoleFormData>({
    resolver: zodResolver(schema) as never,
    mode: 'onChange',
    defaultValues: data,
  });
  const formValues = useWatch({ control }) as CastingRoleFormData;

  useEffect(() => {
    reset(data);
  }, [data.id, reset]);

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
  const selectedPayRateTypeCode = useMemo(
    () => getSiteMetadataStringCodeById(payRateTypeOptionsRaw, formValues?.payRateTypeId),
    [formValues?.payRateTypeId, payRateTypeOptionsRaw]
  );
  const isUnpaidPayRate = selectedPayRateTypeCode === PAY_RATE_TYPE_UNPAID;

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
    if (isUnpaidPayRateType(next, payRateTypeOptionsRaw)) {
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

      <article className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Label className="text-base font-semibold">{t('profile.skills.skills')}</Label>
          <Button type="button" variant="primaryOutline" className="!w-auto" onClick={openSkillsModal}>
            <span className="flex flex-row gap-2">
              <Icon name="plus" size={16} variant="primary" /> {t('profile.skills.add_new_placeholder')}
            </span>
          </Button>
        </div>

        <div className="min-h-[300px] rounded-2xl border border-(--color-secondary-outline) p-4">
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
    </article>
  );
};

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
