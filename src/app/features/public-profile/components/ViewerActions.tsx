import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ButtonRow from '../../../shared/components/ButtonRow/ButtonRow';
import { Icon } from '../../../shared/components/Icon/Icon';
import { isBrowser } from '../../../shared/utils/domUtils';
import { whatsappLink } from '../../../shared/utils/formatUtils';
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
        <Icon name="whatsapp" size={18} />
      </a>
    );
  }

  if (mailtoUrl) {
    items.push(
      <a key="email" href={mailtoUrl} aria-label={t('profile.share.email')} title="Email">
        <Icon name="mail" size={18} />
      </a>
    );
  }

  items.push(<Icon name="copyLink" size={18} onClick={handleShare} />);

  if (items.length === 0) return null;

  return <ButtonRow items={items} className={className} />;
}
