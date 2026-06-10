import { ButtonRow, Icon, showToast } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { shareUrl } from '../../../shared/utils/shareUtils';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';

type Props = {
  data: TalentPublicProfileResponse;
};

export default function ProfileShareActions({ data }: Props) {
  const { t } = useTranslation();
  const { contact, publicSlug } = data;

  const url = `${window.location.origin}/profile/${publicSlug}`;
  const mailtoUrl = contact?.email ? `mailto:${contact.email}` : null;

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

  items.push(<Icon name="copy" onClick={handleShare} />);

  if (items.length === 0) return null;

  return <ButtonRow items={items} />;
}
