import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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

  const actions: React.ReactNode[] = [];

  if (waUrl) {
    actions.push(
      <a
        key="wa"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center cursor-pointer"
        aria-label={t('profile.share.whatsapp')}
        title="WhatsApp"
      >
        <img src={whatsappIcon} alt="" className="w-5" />
      </a>
    );
  }

  if (mailtoUrl) {
    actions.push(
      <a
        key="email"
        href={mailtoUrl}
        className="flex items-center justify-center cursor-pointer"
        aria-label={t('profile.share.email')}
        title="Email"
      >
        <img src={emailIcon} alt="" className="w-5" />
      </a>
    );
  }

  actions.push(
    <button
      key="link"
      type="button"
      onClick={handleShare}
      className="flex items-center justify-center cursor-pointer"
      aria-label={t('profile.share.share_profile')}
      title={t('profile.share.share_profile')}
    >
      <img src={copyLinkIcon} alt="" className="w-5" />
    </button>
  );

  if (actions.length === 0) return null;

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="inline-flex items-center rounded-lg bg-white shadow-sm py-2 px-4">
        {actions.map((node, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="w-px h-8 mx-4 bg-[var(--color-secondary-outline)]" />}
            {node}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
