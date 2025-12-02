import behance from '../../../../../../shared/icons/behance.svg';
import imdb from '../../../../../../shared/icons/imdb.svg';
import instagram from '../../../../../../shared/icons/instagram.svg';
import linkedin from '../../../../../../shared/icons/linkedin.svg';
import tikTok from '../../../../../../shared/icons/tikTok.svg';
import vimeo from '../../../../../../shared/icons/vimeo.svg';
import xIcon from '../../../../../../shared/icons/x.svg';

export const SOCIAL_MEDIA_ICON_BY_CODE: Record<string, string> = {
  'sitemetadata.social_media.instagram': instagram,
  'sitemetadata.social_media.tiktok': tikTok,
  'sitemetadata.social_media.linkedin': linkedin,
  'sitemetadata.social_media.x': xIcon,
  'sitemetadata.social_media.vimeo': vimeo,
  'sitemetadata.social_media.imdb': imdb,
  'sitemetadata.social_media.behance': behance,
};

export function getSocialMediaIcon(stringCode: string | undefined): string | undefined {
  if (!stringCode) return undefined;
  return SOCIAL_MEDIA_ICON_BY_CODE[stringCode];
}
