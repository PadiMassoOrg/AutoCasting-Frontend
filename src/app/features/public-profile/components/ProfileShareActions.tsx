import { useTranslation } from 'react-i18next';
import { Icon } from '../../../shared/components/Icon/Icon';
import { whatsappLink } from '../../../shared/utils/formatUtils';
import { shareUrl } from '../../../shared/utils/shareUtils';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';
import { ButtonRow } from 'autocasting-ui-library-padimasso';

type Props = {
  data: TalentPublicProfileResponse;
};

export default function ProfileShareActions({ data }: Props) {
  const { t } = useTranslation();

  const { basicInfo, contact, publicSlug } = data;

  const url = `${window.location.origin}/profile/${publicSlug}`;

  const text = basicInfo?.stageName
    ? t('profile.share.whatsapp_text', { name: basicInfo.stageName })
    : t('profile.share.whatsapp_text_fallback');

  const waUrl = contact?.phoneNumber ? whatsappLink(contact.phoneNumber, text) : null;
  const mailtoUrl = contact?.email ? `mailto:${contact.email}` : null;

  const handleShare = async () => {
    await shareUrl({
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
        className="inline-flex"
      >
        <Icon name="whatsapp" />
      </a>
    );
  }

  if (mailtoUrl) {
    items.push(
      <a key="email" href={mailtoUrl} aria-label={t('profile.share.email')} title="Email" className="inline-flex">
        <Icon name="mail" />
      </a>
    );
  }

  items.push(<Icon name="copyLink" onClick={handleShare} />);

  if (items.length === 0) return null;

  return <ButtonRow items={items} />;
}
