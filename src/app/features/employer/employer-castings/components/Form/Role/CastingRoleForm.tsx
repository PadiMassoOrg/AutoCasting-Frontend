import { zodResolver } from '@hookform/resolvers/zod';
import {
  BooleanRadioGroup,
  Button,
  CheckboxField,
  FormCurrencyField,
  FormInputField,
  FormSelectField,
  Label,
  MultiSelectDropdown,
  Separator,
  TextareaField,
} from 'autocasting-ui-library-padimasso';
import { useEffect, useMemo, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../context/ModalContext';
import {
  useCachedSiteMetadataOption,
  useCachedSiteMetadataSlice,
} from '../../../../../sitemetadata/hooks/useCachedSiteMetadata';
import type { SiteMetadataObject } from '../../../../../sitemetadata/types/sitemetadata.types';
import { getRoleRemunerationVisiblePayRateTypeOptions } from '../../../../../sitemetadata/utils/siteMetadataUtils';
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
    resolver: zodResolver(schema),
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
  const resolveError = (field: CastingRoleFieldKey) => {
    const local = errors[field];
    return (local?.message as string | undefined) ?? backendErrors?.[field];
  };

  const clearBackend = (field: CastingRoleFieldKey) => {
    onClearBackendError?.(field);
  };

  const updateField = <K extends keyof CastingRoleFormData>(
    field: K,
    value: CastingRoleFormData[K],
    clearBackendField?: CastingRoleFieldKey
  ) => {
    setValue(field, value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
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
      <section className="flex flex-col lg:flex-row lg:gap-4">
        <article className="w-full flex flex-col">
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

          <div className="mb-6">
            <div className="flex mb-1.5">
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
          </div>

          <div>
            <div className="flex mb-1.5">
              <Label className="text-base font-semibold">{t('talent.filter.basic_info.age_range')}</Label>
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
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
          </div>
        </article>

        <article className="w-full flex flex-col">
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
        </article>
      </section>

      <Separator className="opacity-20 my-6" />

      <section className="flex flex-col lg:flex-row lg:gap-4">
        <article className="w-full flex flex-col">
          <FormSelectField
            id="payRateTypeId"
            label={t('employer_castings.dashboard.remunerations.remuneration.pay_rate_type_label')}
            labelClassName="font-semibold text-base"
            placeholder={t('general.placeholder.select')}
            value={formValues?.payRateTypeId ?? ''}
            onChange={(e) => {
              const next = e.target.value || null;
              updateField('payRateTypeId', next, 'payRateTypeId');
            }}
            options={payRateTypeOptions}
            error={resolveError('payRateTypeId')}
            required
          />

          <div className="mb-2 flex">
            <Label className="text-base font-semibold">
              {t('employer_castings.dashboard.remunerations.remuneration.amount_label')}
            </Label>
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-[180px]">
              <FormSelectField
                id="currencyId"
                placeholder={t('general.placeholder.select')}
                value={formValues?.currencyId ?? ''}
                onChange={(e) => {
                  const next = e.target.value || null;
                  updateField('currencyId', next);
                }}
                options={currencyOptions}
              />
            </div>

            <div className="w-full">
              <FormCurrencyField
                id="amount"
                placeholder="0"
                value={formValues?.amount ?? ''}
                onValueChange={(_, rawDigits) => {
                  updateField('amount', rawDigits, 'amount');
                }}
                error={resolveError('amount')}
              />
            </div>
          </div>

          <TextareaField
            id="remunerationNotes"
            label={t('employer_castings.dashboard.remunerations.collaborative.label')}
            placeholder={t('employer_castings.dashboard.remunerations.collaborative.placeholder')}
            value={formValues?.remunerationNotes ?? ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const next = e.target.value;
              updateField('remunerationNotes', next);
            }}
            onBlur={() => {}}
            onKeyDown={() => {}}
          />
        </article>

        <article className="w-full flex flex-col">
          <div className="mb-2">
            <Label className="text-base font-semibold">{t('employer_castings.dashboard.requirements.edit')}</Label>
          </div>

          <div className="flex flex-wrap gap-6 mb-4">
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
            label={t('employer_castings.dashboard.requirements.requirement.description')}
            placeholder={t('general.placeholder.about')}
            value={formValues?.requirementDescription ?? ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const next = e.target.value;
              updateField('requirementDescription', next);
            }}
            onBlur={() => {}}
            onKeyDown={() => {}}
          />
        </article>
      </section>

      <Separator className="opacity-20 my-6" />

      <section className="flex flex-col lg:flex-row lg:gap-4">
        <article className="w-full flex flex-col gap-4">
          <BooleanRadioGroup
            name="tattoo"
            label={t('profile.characteristics.tattoo')}
            value={formValues?.tattoo ?? null}
            includeAnyOption
            anyValueMode="null"
            anyOptionLabel={t('general.indistinct')}
            onChange={(next: boolean | null | undefined) => updateField('tattoo', next ?? null)}
          />
          <BooleanRadioGroup
            name="passport"
            label={t('profile.characteristics.passport')}
            value={formValues?.passport ?? null}
            includeAnyOption
            anyValueMode="null"
            anyOptionLabel={t('general.indistinct')}
            onChange={(next: boolean | null | undefined) => updateField('passport', next ?? null)}
          />
          <BooleanRadioGroup
            name="drivingLicense"
            label={t('profile.characteristics.drivingLicense')}
            value={formValues?.drivingLicense ?? null}
            includeAnyOption
            anyValueMode="null"
            anyOptionLabel={t('general.indistinct')}
            onChange={(next: boolean | null | undefined) => updateField('drivingLicense', next ?? null)}
          />
        </article>

        <article className="w-full flex flex-col">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Label className="text-base font-semibold">{t('profile.skills.skills')}</Label>
            <Button type="button" variant="outline" className="!w-auto" onClick={openSkillsModal}>
              + {t('profile.skills.skills')}
            </Button>
          </div>

          <div className="min-h-[220px] rounded-2xl border border-(--color-secondary-outline) p-4">
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
      </section>

      <TextareaField
        id="description"
        label={t('general.placeholder.description')}
        placeholder={t('general.placeholder.about')}
        value={formValues?.description ?? ''}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          const next = e.target.value;
          updateField('description', next);
        }}
        onBlur={() => {}}
        onKeyDown={() => {}}
      />
    </article>
  );
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
