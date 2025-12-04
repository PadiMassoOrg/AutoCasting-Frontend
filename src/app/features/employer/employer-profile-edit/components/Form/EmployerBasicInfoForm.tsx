import { FormInputField, FormSelectField, Label } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommittedText, useCommittedUuid } from '../../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { useEmployerBasicInfoAutosave } from '../../hooks/autosaves';
import { getEmployerBasicInfoSchema } from '../../schemas/employerBasicInfoSchema';
import type { EmployerProfileBasicInfo } from '../../types/employerProfile.types';

type Errors = {
  companyName?: string | null;
  taxNumber?: string | null;
  companyTypeId?: string | null;
  companyEmail?: string | null;
  address?: string | null;
  websiteUrl?: string | null;
  about?: string | null;
};

type Props = {
  data: EmployerProfileBasicInfo;
};

export default function EmployerBasicInfoForm({ data }: Props) {
  const { t } = useTranslation();
  const autosave = useEmployerBasicInfoAutosave();
  const schema = useMemo(() => getEmployerBasicInfoSchema(t), [t]);
  const companyTypeOptions = useCachedSiteMetadataOption('companyTypeOptions', t);

  const [errors, setErrors] = useState<Errors>({});

  const companyName = useCommittedText(
    data.companyName ?? '',
    (v) => {
      const r = schema.shape.companyName.safeParse(v);
      setErrors((e) => ({
        ...e,
        companyName: r.success ? null : r.error.errors[0]?.message || t('validation.required'),
      }));
      if (r.success) autosave.immediate({ companyName: v });
    },
    { trim: true }
  );

  const taxNumber = useCommittedText(
    data.taxNumber ?? '',
    (v) => {
      const r = schema.shape.taxNumber.safeParse(v);
      setErrors((e) => ({
        ...e,
        taxNumber: r.success ? null : r.error.errors[0]?.message || t('validation.required'),
      }));
      if (r.success) autosave.immediate({ taxNumber: v });
    },
    { trim: true }
  );

  const companyType = useCommittedUuid(
    data.companyType?.id ?? null,
    (id) => {
      const raw = id ?? '';
      const r = schema.shape.companyTypeId.safeParse(raw);
      setErrors((e) => ({
        ...e,
        companyTypeId: r.success ? null : r.error.errors[0]?.message || t('validation.uuid_invalid'),
      }));
      if (r.success) autosave.immediate({ companyTypeId: id ?? undefined });
    },
    { allowNull: true }
  );

  const companyEmail = useCommittedText(
    data.companyEmail ?? '',
    (v) => {
      const r = schema.shape.companyEmail.safeParse(v);
      setErrors((e) => ({
        ...e,
        companyEmail: r.success ? null : r.error.errors[0]?.message || t('validation.email_invalid'),
      }));
      if (r.success) {
        autosave.immediate({ companyEmail: v || null });
      }
    },
    { trim: true }
  );

  const address = useCommittedText(
    data.address ?? '',
    (v) => {
      setErrors((e) => ({
        ...e,
        address: null,
      }));
      autosave.immediate({ address: v || null });
    },
    { trim: true }
  );

  const websiteUrl = useCommittedText(
    data.websiteUrl ?? '',
    (v) => {
      setErrors((e) => ({
        ...e,
        websiteUrl: null,
      }));
      autosave.immediate({ websiteUrl: v || null });
    },
    { trim: true }
  );

  const about = useCommittedText(
    data.about ?? '',
    (v) => {
      setErrors((e) => ({
        ...e,
        about: null,
      }));
      autosave.immediate({ about: v || null });
    },
    { trim: true }
  );

  return (
    <div className="w-full flex flex-col gap-3">
      <FormInputField
        id="companyName"
        label={t('employer_profile.basic_info.company_name')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.company_name')}
        value={companyName.value}
        onChange={companyName.onChange}
        onBlur={companyName.onBlur}
        onKeyDown={companyName.onKeyDown}
        error={errors.companyName ?? undefined}
      />

      <FormInputField
        id="taxNumber"
        label={t('employer_profile.basic_info.tax_number')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.tax_number')}
        value={taxNumber.value}
        onChange={taxNumber.onChange}
        onBlur={taxNumber.onBlur}
        onKeyDown={taxNumber.onKeyDown}
        error={errors.taxNumber ?? undefined}
      />

      <FormSelectField
        id="companyTypeId"
        label={t('employer_profile.basic_info.company_type')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.select')}
        value={companyType.value}
        onChange={companyType.onChange}
        onBlur={companyType.onBlur}
        options={companyTypeOptions}
        error={errors.companyTypeId ?? undefined}
      />

      <FormInputField
        id="companyEmail"
        label={t('employer_profile.basic_info.company_email')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.email')}
        value={companyEmail.value}
        onChange={companyEmail.onChange}
        onBlur={companyEmail.onBlur}
        onKeyDown={companyEmail.onKeyDown}
        error={errors.companyEmail ?? undefined}
      />

      <FormInputField
        id="address"
        label={t('employer_profile.basic_info.address')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.address')}
        value={address.value}
        onChange={address.onChange}
        onBlur={address.onBlur}
        onKeyDown={address.onKeyDown}
        error={errors.address ?? undefined}
      />

      <FormInputField
        id="websiteUrl"
        label={t('employer_profile.basic_info.websiteUrl')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.website')}
        value={websiteUrl.value}
        onChange={websiteUrl.onChange}
        onBlur={websiteUrl.onBlur}
        onKeyDown={websiteUrl.onKeyDown}
        error={errors.websiteUrl ?? undefined}
      />

      <div className="flex flex-col gap-1">
        <Label className="text-sm font-semibold">{t('employer_profile.basic_info.about')}</Label>
        <textarea
          id="about"
          className="w-full min-h-[135px] rounded-md border border-[var(--color-secondary-outline)] px-3 py-2 text-sm"
          placeholder={t('general.placeholder.about')}
          value={about.value}
          onBlur={about.onBlur}
        />
        {errors.about && <span className="text-sm text-red-600">{errors.about}</span>}
      </div>
    </div>
  );
}
