import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommittedText } from '../../../../../shared/utils/formUtils';
import { useSocialMediaAutosave } from '../../hooks/autosaves';
import { getSocialMediaSchema } from '../../schemas/socialMediaSchema'; // 👈 nuevo
import type { TalentProfileSocialMedia } from '../../types/talentProfile.types';

export default function SocialMediaForm({ data }: { data: TalentProfileSocialMedia }) {
  const { t } = useTranslation();
  const autosave = useSocialMediaAutosave();
  const schema = useMemo(() => getSocialMediaSchema(t, true), [t]);
  const [errors, setErrors] = useState<{ instagram?: string | null; tiktok?: string | null }>({});

  const instagramUrl = useCommittedText(
    data.instagramUrl ?? '',
    (v) => {
      const r = schema.shape.instagramUrl.safeParse(v);
      setErrors((e) => ({
        ...e,
        instagram: r.success ? null : (r.error.errors[0]?.message ?? t('validation.url_invalid')),
      }));
      if (r.success) autosave.immediate({ instagramUrl: v.trim() });
    },
    { trim: true }
  );

  const tikTokUrl = useCommittedText(
    data.tikTokUrl ?? '',
    (v) => {
      const r = schema.shape.tikTokUrl.safeParse(v);
      setErrors((e) => ({
        ...e,
        tiktok: r.success ? null : (r.error.errors[0]?.message ?? t('validation.url_invalid')),
      }));
      if (r.success) autosave.immediate({ tikTokUrl: v.trim() });
    },
    { trim: true }
  );

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.basic_info.social_media')}</h3>

      <FormInputField
        id="instagramUrl"
        label={t('profile.basic_info.instagram')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.url')}
        value={instagramUrl.value}
        onChange={instagramUrl.onChange}
        onBlur={instagramUrl.onBlur}
        onKeyDown={instagramUrl.onKeyDown}
        error={errors.instagram ?? undefined}
      />

      <FormInputField
        id="tikTokUrl"
        label={t('profile.basic_info.tikTok')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.url')}
        value={tikTokUrl.value}
        onChange={tikTokUrl.onChange}
        onBlur={tikTokUrl.onBlur}
        onKeyDown={tikTokUrl.onKeyDown}
        error={errors.tiktok ?? undefined}
      />
    </div>
  );
}
