import { ButtonRow, Icon } from 'autocasting-ui-library-padimasso';
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

  items.push(<Icon name="copyLink" onClick={handleShare} />);

  if (items.length === 0) return null;

  return <ButtonRow items={items} />;
}
