import instagram from '../../icons/instagram.svg';
import tikTok from '../../icons/tikTok.svg';
import { useTranslation } from 'react-i18next';
import type { ProfileSocialMedia } from '../../types/profile.types';

function normalizeExternalUrl(raw?: string | null): string | null {
  if (!raw) return null;
  let url = raw.trim();

  // Adjust https
  if (!/^https?:\/\//i.test(url)) {
    // permite cosas tipo example.com o tiktok.com/user
    if (/^[\w.-]+\.[a-z]{2,}($|[\/?#])/i.test(url)) {
      url = `https://${url}`;
    } else {
      return null;
    }
  }

  // Bloquea esquemas peligrosos
  const lower = url.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) return null;

  return url;
}

function SocialLink({ href, label, iconSrc }: { href: string | null; label: string; iconSrc: string }) {
  const commonClasses = 'rounded-md p-4 flex items-center justify-center w-12 h-12';
  const enabled = !!href;

  if (!enabled) {
    return (
      <span
        aria-disabled="true"
        className={`bg-[var(--color-primary-light-grey)] opacity-50 ${commonClasses}`}
        title={label}
      >
        <img src={iconSrc} alt="" className="w-5 h-5" />
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`bg-[var(--color-primary-light-grey)] hover:opacity-90 transition ${commonClasses}`}
    >
      <img src={iconSrc} alt="" className="w-5 h-5" />
    </a>
  );
}

const SocialMediaSection = ({ data }: { data: ProfileSocialMedia }) => {
  const { t } = useTranslation();

  const instaUrl = normalizeExternalUrl(data.instagramUrl);
  const tiktokUrl = normalizeExternalUrl(data.tikTokUrl);

  return (
    <article className="flex flex-col gap-4 items-center">
      <h2 className="text-lg font-bold">{t('profile.page.socials')}:</h2>

      <div className="w-full flex gap-4 items-center justify-center">
        <SocialLink href={instaUrl} label="Instagram" iconSrc={instagram} />
        <SocialLink href={tiktokUrl} label="TikTok" iconSrc={tikTok} />
      </div>
    </article>
  );
};

export default SocialMediaSection;
