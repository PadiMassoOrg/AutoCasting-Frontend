import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useCommittedText } from '../../../../shared/utils/formUtils';
import { useSocialMediaAutosave } from '../../hooks/autosaves';
import type { ProfileSocialMedia } from '../../types/profile.types';

export default function SocialMediaForm({ data }: { data: ProfileSocialMedia }) {
  const { t } = useTranslation();
  const socialMediaAutosave = useSocialMediaAutosave();

  const instagramUrl = useCommittedText(
    data.instagramUrl ?? '',
    (v) => socialMediaAutosave.immediate({ instagramUrl: v }),
    {
      trim: true,
    }
  );

  const tikTokUrl = useCommittedText(data.tikTokUrl ?? '', (v) => socialMediaAutosave.immediate({ tikTokUrl: v }), {
    trim: true,
  });

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
      />

      <FormInputField
        id="phoneNumber"
        label={t('profile.basic_info.tikTok')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.url')}
        value={tikTokUrl.value}
        onChange={tikTokUrl.onChange}
        onBlur={tikTokUrl.onBlur}
        onKeyDown={tikTokUrl.onKeyDown}
      />
    </div>
  );
}
