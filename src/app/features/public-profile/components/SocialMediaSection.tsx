import ButtonRow from '../../../shared/components/ButtonRow/ButtonRow';
import { Icon } from '../../../shared/components/Icon/Icon';
import { normalizeExternalUrl } from '../../../shared/utils/urlUtils';
import { getSocialMediaIconName } from '../../talent/talent-profile-edit/components/Form/SocialMedia/SocialMediaIconMapper';
import type { TalentProfileSocialMedia } from '../../talent/talent-profile-edit/types/talentProfile.types';

type Props = {
  data: TalentProfileSocialMedia;
};

const SocialMediaSection = ({ data }: Props) => {
  const items =
    data.links
      ?.filter((link) => !!link.url && link.url.trim().length > 0)
      .map((link) => {
        const href = normalizeExternalUrl(link.url);
        if (!href) return null;

        const iconName = getSocialMediaIconName(link.stringCode);
        if (!iconName) return null;

        const label = link.stringCode;

        return (
          <a
            key={link.optionId}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="w-full h-full"
          >
            <Icon name={iconName} size={18} />
          </a>
        );
      })
      .filter(Boolean) ?? [];

  if (items.length === 0) return null;

  return <ButtonRow items={items} />;
};

export default SocialMediaSection;
