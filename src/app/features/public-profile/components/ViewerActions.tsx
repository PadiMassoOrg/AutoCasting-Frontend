import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ButtonRow from '../../../shared/components/ButtonRow/ButtonRow';
import copyLinkIcon from '../../../shared/icons/copy-link.svg';
import emailIcon from '../../../shared/icons/message.svg';
import whatsappIcon from '../../../shared/icons/whatsapp.svg';
import { isBrowser } from '../../../shared/utils/domUtils';
import { whatsappLink } from '../../../shared/utils/phoneUtils';
import { shareUrl } from '../../../shared/utils/shareUtils';
import { usePublicProfile } from '../hooks/usePublicProfile';

type Props = { className?: string };

export default function ViewerActions({ className }: Props) {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePublicProfile(slug!);

  const url = isBrowser ? window.location.href : '';

  const text = data?.basicInfo?.stageName
    ? t('profile.share.whatsapp_text', { name: data.basicInfo.stageName })
    : t('profile.share.whatsapp_text_fallback');

  const waUrl = data?.contact?.phoneNumber ? whatsappLink(data.contact.phoneNumber, text) : null;
  const mailtoUrl = data?.contact?.email ? `mailto:${data.contact.email}` : null;

  const handleShare = async () => {
    await shareUrl({
      title: data?.basicInfo?.stageName ?? t('profile.share.profile_no_name'),
      url,
      onCopied: () => alert(t('general.copied')),
      onError: () => alert(t('general.error')),
    });
  };

  const items: React.ReactNode[] = [];

  if (waUrl) {
    items.push(
      <a
        key="wa"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('profile.share.whatsapp')}
        title="WhatsApp"
      >
        <img src={whatsappIcon} alt="" className="w-5" />
      </a>
    );
  }

  if (mailtoUrl) {
    items.push(
      <a key="email" href={mailtoUrl} aria-label={t('profile.share.email')} title="Email">
        <img src={emailIcon} alt="" className="w-5" />
      </a>
    );
  }

  items.push(
    <button
      key="link"
      type="button"
      onClick={handleShare}
      aria-label={t('profile.share.share_profile')}
      title={t('profile.share.share_profile')}
    >
      <img src={copyLinkIcon} alt="" className="w-5" />
    </button>
  );

  if (items.length === 0) return null;

  return <ButtonRow items={items} className={className} />;
}
