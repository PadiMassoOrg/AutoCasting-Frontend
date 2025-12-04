import { FormInputField, FormSelectField, Label, Separator } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEmployerLogoPatch } from '../../../../../integrations/supabase/media/hooks/useEmployerLogoPatch';
import { useCommittedText, useCommittedUuid } from '../../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { SocialMediaForm } from '../../../../talent/talent-profile-edit/components/Form/SocialMedia';
import UploadTile from '../../../../talent/talent-profile-edit/components/UploadTile/UploadTile';
import { fileSchema } from '../../../../talent/talent-profile-edit/schemas/mediaSchema';
import type { ProfileSocialMedia } from '../../../../talent/talent-profile-edit/types/talentProfile.types';
import { useEmployerBasicInfoAutosave, useEmployerSocialMediaAutosave } from '../../hooks/autosaves';
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
  imageUrl?: string | null;
};

type Props = {
  data: EmployerProfileBasicInfo;
  profileId: string;
};

export default function EmployerBasicInfoForm({ data, profileId }: Props) {
  const { t } = useTranslation();
  const autosave = useEmployerBasicInfoAutosave();
  const socialMediaAutosave = useEmployerSocialMediaAutosave();
  const schema = useMemo(() => getEmployerBasicInfoSchema(t), [t]);
  const companyTypeOptions = useCachedSiteMetadataOption('companyTypeOptions', t);

  const [errors, setErrors] = useState<Errors>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errImage, setErrImage] = useState<string | null>(null);
  const [bust, setBust] = useState(0);

  const { mutate: uploadLogo, isPending: uploadPending } = useEmployerLogoPatch(profileId);

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

  const handleSelectLogo = async (files: File[] | File) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;

    const res = fileSchema(t).safeParse(file);
    if (!res.success) {
      const msg = res.error.errors[0]?.message ?? t('state.server_err');
      setErrImage(msg);
      setErrors((e) => ({ ...e, imageUrl: msg }));
      return;
    }

    setErrImage(null);
    setErrors((e) => ({ ...e, imageUrl: null }));

    const localUrl = await fileToDataUrl(file);
    setPreviewUrl(localUrl);

    uploadLogo(
      { file },
      {
        onSuccess: () => {
          setPreviewUrl(null);
          setBust((prev) => prev + 1);
        },
        onError: (err: unknown) => {
          const anyErr = err as any;
          const msg = anyErr?.response?.data?.message || anyErr?.message || t('state.server_err');
          setErrImage(msg);
          setErrors((e) => ({ ...e, imageUrl: msg }));
        },
      }
    );
  };

  const handleDeleteLogo = () => {
    setPreviewUrl(null);
    setErrImage(null);
    setErrors((e) => ({ ...e, imageUrl: null }));
    autosave.immediate({ imageUrl: null });
    setBust((prev) => prev + 1);
  };

  const logoUrl = uploadPending ? undefined : withBust(data.imageUrl ?? null, bust);
  const isLogoBusy = uploadPending;

  const socialMediaData: ProfileSocialMedia = (data.socialMedia ?? { links: [] }) as ProfileSocialMedia;

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <div className="flex flex-col gap-1">
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
        </div>

        <div className="flex flex-col gap-2 items-start lg:items-center">
          <Label className="text-sm font-semibold self-start">{t('employer_profile.basic_info.image')}</Label>
          <div className="w-[210px] aspect-[3/4]">
            <UploadTile
              value={logoUrl}
              previewUrl={previewUrl}
              onSelect={handleSelectLogo}
              onDeleteClick={handleDeleteLogo}
              disabled={isLogoBusy}
              busy={isLogoBusy}
              busyText={t('state.loading')}
              accept="image/*"
              maxSizeMB={8}
              objectFit="cover"
              multiple={false}
              openOnClick={!isLogoBusy}
              className="w-full h-full"
            />
          </div>

          {errImage ? (
            <span className="text-xs text-red-600 max-h-[25px]">{errImage}</span>
          ) : (
            <div className="min-h-[25px]" />
          )}
        </div>
      </div>

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
          onChange={(e) => about.onChange(e as any)}
          onBlur={(e) => about.onBlur(e as any)}
          onKeyDown={(e) => about.onKeyDown(e as any)}
        />
        {errors.about && <span className="text-sm text-red-600">{errors.about}</span>}
      </div>

      <Separator className="opacity-20 my-8" />

      <SocialMediaForm data={socialMediaData} onSaveLinks={(payload) => socialMediaAutosave.immediate(payload)} />
    </div>
  );
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const withBust = (url: string | null | undefined, bust?: number): string | undefined => {
  if (!url) return undefined;
  if (!bust) return url;
  return url.includes('?') ? `${url}&b=${bust}` : `${url}?b=${bust}`;
};
