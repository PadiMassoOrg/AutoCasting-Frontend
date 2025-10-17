import { useTranslation } from 'react-i18next';
import instagram from '../../../../shared/icons/instagram.svg';
import tikTok from '../../../../shared/icons/tikTok.svg';
import { normalizeExternalUrl } from '../../../../shared/utils/urlUtils';
import type { TalentProfileSocialMedia } from '../../talent/talent-profile-edit/types/talentProfile.types';

const SocialMediaSection = ({ data, className }: { data: TalentProfileSocialMedia; className?: string }) => {
  const { t } = useTranslation();

  const instaUrl = normalizeExternalUrl(data.instagramUrl);
  const tiktokUrl = normalizeExternalUrl(data.tikTokUrl);

  return (
    <article className={`w-full ${className ?? ''}`}>
      <h2 className="text-base font-extrabold">{t('profile.page.socials')}:</h2>
      <div className={`flex gap-2 items-center`}>
        {instaUrl && <SocialLink href={instaUrl} label="Instagram" iconSrc={instagram} />}
        {tiktokUrl && <SocialLink href={tiktokUrl} label="TikTok" iconSrc={tikTok} />}
      </div>
    </article>
  );
};

export default SocialMediaSection;

function SocialLink({ href, label, iconSrc }: { href: string | null; label: string; iconSrc: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="bg-[var(--color-primary-light-grey)] hover:opacity-90 transition rounded-md p-4 flex items-center justify-center w-12 h-12"
      title={label}
    >
      <img src={iconSrc} alt="" className="w-5 h-5" />
    </a>
  );
}
