import { FormInputField } from 'autocasting-ui-library-padimasso';
import type { ProfileSocialMedia } from '../../../types/profile.types';
import { useTranslation } from 'react-i18next';
import {
  useCallback,
  useRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type KeyboardEventHandler,
} from 'react';
import { useSocialMediaAutosave } from '../../../hooks/autosaves';

export default function SocialMediaForm({ data }: { data: ProfileSocialMedia }) {
  const { t } = useTranslation();
  const socialMediaAutosave = useSocialMediaAutosave();

  const [instagramUrl, setInstagramUrl] = useState(data.instagramUrl ?? '');
  const [tikTokUrl, setTikTokUrl] = useState(data.tikTokUrl ?? '');

  const lastCommittedInstagramUrl = useRef<string>(data.instagramUrl ?? '');
  const lastCommittedTikTokUrl = useRef<string>(data.tikTokUrl ?? '');

  // Instagram
  const commitInstagramUrl = useCallback(() => {
    const trimmed = instagramUrl.trim();
    if (trimmed && trimmed !== lastCommittedInstagramUrl.current) {
      lastCommittedInstagramUrl.current = trimmed;
      socialMediaAutosave.immediate({ instagramUrl: trimmed });
    }
  }, [instagramUrl, socialMediaAutosave]);

  const onInstagramUrlChanged = useCallback((v: string) => {
    setInstagramUrl(v);
  }, []);

  // TikTok
  const commitTikTokUrl = useCallback(() => {
    const trimmed = tikTokUrl.trim();
    if (trimmed && trimmed !== lastCommittedTikTokUrl.current) {
      lastCommittedTikTokUrl.current = trimmed; // evita doble envío
      socialMediaAutosave.immediate({ tikTokUrl: trimmed });
    }
  }, [tikTokUrl, socialMediaAutosave]);

  const onTikTokUrlChange = useCallback((v: string) => {
    setTikTokUrl(v);
  }, []);

  // Handlers
  const handleInstagramUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onInstagramUrlChanged(e.target.value);
  };

  const handleInstagramUrlKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitInstagramUrl();
    }
  };

  const handleInstagramUrlBlur: FocusEventHandler<HTMLInputElement> = () => {
    commitInstagramUrl();
  };
  // Handlers
  const handleTikTokUrlChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onTikTokUrlChange(e.target.value);
  };

  const handleTikTokUrlKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitTikTokUrl();
    }
  };

  const handleTikTokUrlBlur: FocusEventHandler<HTMLInputElement> = () => {
    commitTikTokUrl();
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <h3 className="font-bold text-base">{t('profile.basic_info.social_media')}</h3>

      <FormInputField
        id="instagramUrl"
        label={t('profile.basic_info.instagram')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.url')}
        value={instagramUrl}
        onChange={handleInstagramUrlChange}
        onBlur={handleInstagramUrlBlur}
        onKeyDown={handleInstagramUrlKeyDown}
      />

      <FormInputField
        id="phoneNumber"
        label={t('profile.basic_info.tikTok')}
        labelClassName="font-semibold text-base"
        placeholder={t('general.placeholder.url')}
        value={tikTokUrl}
        onChange={handleTikTokUrlChange}
        onBlur={handleTikTokUrlBlur}
        onKeyDown={handleTikTokUrlKeyDown}
      />
    </div>
  );
}
