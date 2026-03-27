import { ButtonRow, Icon } from 'autocasting-ui-library-padimasso';
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
    // TODO: Implementar TOAST
    await shareUrl({
      url,
      onCopied: () => alert(t('general.copied')),
      onError: () => alert(t('general.error')),
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
