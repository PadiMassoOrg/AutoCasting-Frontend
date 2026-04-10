import { ButtonRow, Icon, showToast } from 'autocasting-ui-library-padimasso';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { isBrowser } from '../../../shared/utils/domUtils';
import { shareUrl } from '../../../shared/utils/shareUtils';
import { usePublicProfile } from '../hooks/usePublicProfile';

type Props = { className?: string };

export default function ViewerActions({ className }: Props) {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePublicProfile(slug);

  const url = isBrowser ? window.location.href : '';

  const mailtoUrl = data?.contact?.email ? `mailto:${data.contact.email}` : null;

  const handleShare = async () => {
    await shareUrl({
      url,
      onCopied: () => showToast({ title: t('general.copied'), description: t('general.copied'), type: 'default' }),
      onError: () => showToast({ title: t('general.error'), description: t('general.error'), type: 'danger' }),
    });
  };

  const items: React.ReactNode[] = [];

  if (mailtoUrl) {
    items.push(
      <a key="email" href={mailtoUrl} aria-label={t('profile.share.email')} title="Email" className="inline-flex">
        <Icon name="mail" />
      </a>
    );
  }

  items.push(<Icon key="copy-link" name="copyLink" onClick={handleShare} />);

  if (items.length === 0) return null;

  return <ButtonRow items={items} className={className} />;
}
