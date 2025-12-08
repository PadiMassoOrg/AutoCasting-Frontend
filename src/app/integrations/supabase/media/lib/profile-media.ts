import { supabase } from '../../../../shared/lib/supabase';
import { SUPABASE } from '../../constants';

export async function uploadPublic(key: string, file: File) {
  const { error } = await supabase.storage.from(SUPABASE.MAIN_BUCKET).upload(key, file, {
    upsert: false,
    cacheControl: '31536000',
    contentType: file.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(SUPABASE.MAIN_BUCKET).getPublicUrl(key);
  return { publicUrl: data.publicUrl, key };
}

export async function removeByPublicUrl(publicUrl: string) {
  const clean = publicUrl.split('#')[0].split('?')[0];
  const marker = `/storage/v1/object/public/${SUPABASE.MAIN_BUCKET}/`;
  const idx = clean.indexOf(marker);
  if (idx === -1) {
    throw new Error('URL pública inválida: no se pudo resolver el key');
  }

  const keyEncoded = clean.slice(idx + marker.length); // "profiles/.../file.jpg"
  const key = decodeURIComponent(keyEncoded);

  const { error } = await supabase.storage.from(SUPABASE.MAIN_BUCKET).remove([key]);
  if (error) throw error;
}
