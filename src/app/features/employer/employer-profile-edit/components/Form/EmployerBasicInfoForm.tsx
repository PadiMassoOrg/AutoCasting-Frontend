import {
  FormInputField,
  FormSelectField,
  Label,
  Separator,
  TextareaField,
  UploadTile,
} from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../../context/ToastContext';
import { useEmployerLogoPatch } from '../../../../../integrations/supabase/media/hooks/useEmployerLogoPatch';
import { getBackendErrorMessage } from '../../../../../shared/utils/backendErrorHandling';
import { useCommittedText, useCommittedUuid } from '../../../../../shared/utils/formUtils';
import { useCachedSiteMetadataOption } from '../../../../sitemetadata/hooks/useCachedSiteMetadata';
import { SocialMediaForm } from '../../../../talent/talent-profile-edit/components/Form/SocialMedia';
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
  const { showToast } = useToast();
  const autosave = useEmployerBasicInfoAutosave();
  const socialMediaAutosave = useEmployerSocialMediaAutosave();
  const schema = useMemo(() => getEmployerBasicInfoSchema(t), [t]);
  const companyTypeOptions = useCachedSiteMetadataOption('companyTypeOptions', t);
  const backendFieldErrors = autosave.fieldErrors as Record<string, string | undefined>;

  const [errors, setErrors] = useState<Errors>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errImage, setErrImage] = useState<string | null>(null);
  const [bust, setBust] = useState(0);

  const { mutate: uploadLogo, isPending: uploadPending } = useEmployerLogoPatch(profileId);

  const currentLogoUrl = data.imageUrl ?? null;

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
      { file, previousUrl: currentLogoUrl ?? undefined },
      {
        onSuccess: () => {
          setPreviewUrl(null);
          setBust((prev) => prev + 1);
        },
        onError: (err: unknown) => {
          const msg = getBackendErrorMessage(err, t);
          setErrImage(msg);
          setErrors((e) => ({ ...e, imageUrl: msg }));
        },
      }
    );
  };

  const handleDeleteLogo = () => {
    showToast({
      title: t('general.warning'),
      description: t('profile.media.must_have_one_photo'),
      type: 'warning',
      durationMs: 5500,
    });
  };

  const logoUrl = uploadPending ? undefined : withBust(currentLogoUrl, bust);
  const isLogoBusy = uploadPending;

  const socialMediaData: ProfileSocialMedia = (data.socialMedia ?? { links: [] }) as ProfileSocialMedia;
  const resolveError = (field: string, local?: string | null) => local ?? backendFieldErrors[field] ?? undefined;

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="relative flex flex-col lg:gap-2 lg:block">
        <div className="flex flex-col gap-1 lg:pr-[280px]">
          <FormInputField
            id="companyName"
            label={t('employer_profile.basic_info.company_name')}
            labelClassName="font-semibold text-base"
            placeholder={t('general.placeholder.company_name')}
            value={companyName.value}
            onChange={companyName.onChange}
            onBlur={companyName.onBlur}
            onKeyDown={companyName.onKeyDown}
            error={resolveError('companyName', errors.companyName)}
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
            error={resolveError('taxNumber', errors.taxNumber)}
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
            error={resolveError('companyTypeId', errors.companyTypeId)}
          />
        </div>

        <div className="w-full max-w-[240px] lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-[240px]">
          <div className="grid gap-1 lg:h-full lg:grid-rows-[auto_minmax(0,1fr)_25px]">
            <Label className="w-full self-start text-sm font-semibold">{t('employer_profile.basic_info.image')}</Label>
            <div className="w-full aspect-[3/4] lg:h-full lg:min-h-0 lg:aspect-auto">
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
              <span className="w-full min-h-[25px] text-sm text-red-600">{errImage}</span>
            ) : (
              <div className="min-h-[25px] w-full" />
            )}
          </div>
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
        error={resolveError('companyEmail', errors.companyEmail)}
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
        error={resolveError('address', errors.address)}
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
        error={resolveError('websiteUrl', errors.websiteUrl)}
      />

      <TextareaField
        id="about"
        label={t('employer_profile.basic_info.about')}
        placeholder={t('general.placeholder.about')}
        value={about.value}
        onChange={about.onChange}
        onBlur={about.onBlur}
        onKeyDown={about.onKeyDown}
        error={resolveError('about', errors.about)}
      />

      <Separator className="opacity-20 my-8" />

      <SocialMediaForm
        data={socialMediaData}
        onSaveLinks={(payload) => socialMediaAutosave.immediate(payload)}
        isLoading={socialMediaAutosave.isPending}
      />
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
