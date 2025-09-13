import { useTranslation } from 'react-i18next';
import instagram from '../../../shared/icons/instagram.svg';
import tikTok from '../../../shared/icons/tikTok.svg';
import { normalizeExternalUrl } from '../../../shared/utils/urlUtils';
import type { ProfileSocialMedia } from '../../profile-edit/types/profile.types';

const SocialMediaSection = ({ data, className }: { data: ProfileSocialMedia; className?: string }) => {
  const { t } = useTranslation();

  const instaUrl = normalizeExternalUrl(data.instagramUrl);
  const tiktokUrl = normalizeExternalUrl(data.tikTokUrl);

  if (!instaUrl && !tiktokUrl) return null;
  return (
    <article className={`w-full ${className ?? ''}`}>
      <h2 className="text-lg font-bold">{t('profile.page.socials')}:</h2>
      <div className={`flex gap-4 items-center`}>
        <SocialLink href={instaUrl} label="Instagram" iconSrc={instagram} />
        <SocialLink href={tiktokUrl} label="TikTok" iconSrc={tikTok} />
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
