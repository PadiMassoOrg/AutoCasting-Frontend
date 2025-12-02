import ButtonRow from '../../../shared/components/ButtonRow/ButtonRow';
import { normalizeExternalUrl } from '../../../shared/utils/urlUtils';
import { getSocialMediaIcon } from '../../talent/talent-profile-edit/components/Form/SocialMedia/SocialMediaIconMapper';
import type { TalentProfileSocialMedia } from '../../talent/talent-profile-edit/types/talentProfile.types';

type Props = {
  data: TalentProfileSocialMedia;
  className?: string;
};

const SocialMediaSection = ({ data, className }: Props) => {
  const items =
    data.links
      ?.filter((link) => !!link.url && link.url.trim().length > 0)
      .map((link) => {
        const href = normalizeExternalUrl(link.url);
        if (!href) return null;

        const iconSrc = getSocialMediaIcon(link.stringCode);
        if (!iconSrc) return null;

        const label = link.stringCode;

        return (
          <a key={link.optionId} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
            <img src={iconSrc} alt="" className="w-5 h-5" />
          </a>
        );
      })
      .filter(Boolean) ?? [];

  if (items.length === 0) return null;

  return (
    <article className={`${className ?? ''}`}>
      <ButtonRow items={items} />
    </article>
  );
};

export default SocialMediaSection;
