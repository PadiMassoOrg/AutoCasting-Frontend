import { SUPABASE } from '../../integrations/supabase/constants';

// Listing thumbnails live next to the original photo, under the original key plus this suffix.
// The Backend follows the same convention (MediaThumbnails.java) when it deletes media.
export const THUMBNAIL_SUFFIX = '.thumb.webp';

// Only photos uploaded by the app have a thumbnail: `<root>/<id>/media/<slot>/<timestamp>.<ext>` for
// talents and `<root>/<id>/logo/<timestamp>.<ext>` for employers. Anything else (seed data, other
// buckets, external URLs) keeps its original URL so no request is wasted on a thumbnail that can't exist.
const UPLOADED_KEY = new RegExp(
  `^(${SUPABASE.TALENT_BUCKET}/[^/]+/${SUPABASE.MEDIA}/(headshot|fullbody|other)|${SUPABASE.EMPLOYER_BUCKET}/[^/]+/${SUPABASE.LOGO})/\\d+\\.[a-z0-9]+$`,
  'i'
);

export function toThumbnailKey(key: string): string {
  return `${key}${THUMBNAIL_SUFFIX}`;
}

export function toThumbnailUrl(url?: string | null): string | null {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!url || !supabaseUrl) return null;

  const prefix = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/${SUPABASE.MAIN_BUCKET}/`;
  const [path] = url.split(/[?#]/);
  if (!path.startsWith(prefix)) return null;

  const key = path.slice(prefix.length);
  if (key.endsWith(THUMBNAIL_SUFFIX)) return path;
  if (!UPLOADED_KEY.test(key)) return null;
  return `${path}${THUMBNAIL_SUFFIX}`;
}
