import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import message from '../../../shared/icons/message.svg';
import share from '../../../shared/icons/share.svg';
import { isBrowser } from '../../../shared/utils/domUtils';
import { whatsappLink } from '../../../shared/utils/phoneUtils';
import { shareUrl } from '../../../shared/utils/shareUtils';
import { usePublicProfile } from '../hooks/usePublicProfile';

export default function ViewerActions() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePublicProfile(slug!);

  const url = isBrowser ? window.location.href : '';
  // TODO - Definir Texts o Template
  const text = data?.basicInfo?.stageName
    ? t('profile.share.whatsapp_text', { name: data.basicInfo.stageName })
    : t('profile.share.whatsapp_text_fallback');
  const waUrl = data?.contact?.phoneNumber ? whatsappLink(data.contact.phoneNumber, text) : null;
  const mailtoUrl = data?.contact?.email ? `mailto:${data.contact.email}` : null;

  const handleShare = async () => {
    await shareUrl({
      title: data?.basicInfo?.stageName ?? t('profile.share.profile_no_name'),
      url,
      // TODO - Definir Toasts o como dar output al user
      onCopied: () => alert(t('general.copied')),
      onError: () => alert(t('general.error')),
    });
  };

  return (
    <div className="w-full flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer"
        aria-label={t('profile.share.share_profile')}
        title={t('profile.share.share_profile')}
      >
        <img src={share} alt="" className="w-5" />
      </button>

      {waUrl ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer"
          aria-label={t('profile.share.whatsapp')}
          title="WhatsApp"
        >
          <img src={message} alt="" className="w-5" />
        </a>
      ) : mailtoUrl ? (
        <a
          href={mailtoUrl}
          className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center cursor-pointer"
          aria-label={t('profile.share.email')}
          title="Email"
        >
          <img src={message} alt="" className="w-5" />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="bg-[var(--color-primary-light-grey)] rounded-md p-3 flex items-center justify-center opacity-50 cursor-not-allowed"
          title={t('profile.share.no_contact')}
          aria-label={t('profile.share.no_contact')}
        >
          <img src={message} alt="" className="w-5" />
        </button>
      )}
    </div>
  );
}
