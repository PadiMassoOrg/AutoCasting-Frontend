import behance from '../../../../../../shared/icons/behance.svg';
import imdb from '../../../../../../shared/icons/imdb.svg';
import instagram from '../../../../../../shared/icons/instagram.svg';
import linkedin from '../../../../../../shared/icons/linkedin.svg';
import tikTok from '../../../../../../shared/icons/tikTok.svg';
import vimeo from '../../../../../../shared/icons/vimeo.svg';
import xIcon from '../../../../../../shared/icons/x.svg';

export const SOCIAL_MEDIA_ICON_BY_CODE: Record<string, string> = {
  'sitemetadata.social.instagram': instagram,
  'sitemetadata.social.tiktok': tikTok,
  'sitemetadata.social.linkedin': linkedin,
  'sitemetadata.social.x': xIcon,
  'sitemetadata.social.vimeo': vimeo,
  'sitemetadata.social.imdb': imdb,
  'sitemetadata.social.behance': behance,
};

export function getSocialMediaIcon(stringCode: string | undefined): string | undefined {
  if (!stringCode) return undefined;
  return SOCIAL_MEDIA_ICON_BY_CODE[stringCode];
}
