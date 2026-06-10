export const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Permite nombres con espacios y caracteres comunes en nombres comerciales y artísticos
export const NAME_RX = /^[A-Za-zÀ-ÿ0-9\s\-\&'.,()\/#+]+$/;

// Casi todos los formatos de CUIT/CUIL/RUC tienen dígitos, guiones y/o espacios
export const TAX_NUMBER_RX = /^[A-Za-z0-9\-\s]+$/;

export const ALLOWED_EXTERNAL_DOMAINS = [
  // Video
  'youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',

  // Cloud / documents
  'drive.google.com',
  'docs.google.com',
  'dropbox.com',
  'dropboxusercontent.com',
  'onedrive.live.com',
  '1drv.ms',
  'icloud.com',
  'box.com',
  'canva.com',

  // Portfolio
  'imdb.com',
  'pro.imdb.com',
  'imdb.me',
  'behance.net',
  'adobe.com',
  'myportfolio.com',
  'artstation.com',
  'deviantart.com',
  'flickr.com',
  '500px.com',
  'notion.site',
  'notion.so',
  'carrd.co',
  'about.me',

  // Social
  'instagram.com',
  'tiktok.com',
  'facebook.com',
  'linkedin.com',
  'x.com',
  'twitter.com',

  // Link-in-bio
  'linktr.ee',
  'beacons.ai',
  'bio.site',
  'campsite.bio',
  'solo.to',

  // Stock / reference, optional
  'pexels.com',
  'unsplash.com',
] as const;

export const parseHttpUrl = (value: string): URL | null => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url;
  } catch {
    return null;
  }
};

export const isHostnameAllowed = (hostname: string, allowedHosts: readonly string[]): boolean => {
  const normalizedHostname = hostname.toLowerCase();
  return allowedHosts.some(
    (allowedHost) => normalizedHostname === allowedHost || normalizedHostname.endsWith(`.${allowedHost}`)
  );
};

export const isAllowedExternalUrl = (rawUrl: string): boolean => {
  const url = parseHttpUrl(rawUrl);
  if (!url || url.protocol !== 'https:') return false;

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  return isHostnameAllowed(hostname, ALLOWED_EXTERNAL_DOMAINS);
};
