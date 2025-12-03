import type { IconName } from '../../../../../../shared/components/Icon/Icon';

export const SOCIAL_MEDIA_ICON_BY_CODE: Record<string, IconName> = {
  'sitemetadata.social_media.instagram': 'instagram',
  'sitemetadata.social_media.tiktok': 'tikTok',
  'sitemetadata.social_media.linkedin': 'linkedin',
  'sitemetadata.social_media.x': 'x',
  'sitemetadata.social_media.vimeo': 'vimeo',
  'sitemetadata.social_media.imdb': 'imdb',
  'sitemetadata.social_media.behance': 'behance',
};

export function getSocialMediaIconName(stringCode: string | undefined): IconName | undefined {
  if (!stringCode) return undefined;
  return SOCIAL_MEDIA_ICON_BY_CODE[stringCode];
}
