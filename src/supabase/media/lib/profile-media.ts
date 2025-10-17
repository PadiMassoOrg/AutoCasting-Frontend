import { supabase } from '../../../shared/lib/supabase';

const BUCKET_NAME = 'profile-media-public';

export async function uploadPublic(key: string, file: File) {
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(key, file, {
    upsert: false,
    cacheControl: '31536000',
    contentType: file.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(key);
  return { publicUrl: data.publicUrl, key };
}

export async function cleanupOldSlotFiles(profileId: string, slot: 'headshot' | 'fullbody', keepKey: string) {
  const dir = `profiles/${profileId}/media/${slot}`;
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(dir, { limit: 100 });
  if (error || !data?.length) return;

  const toRemove = data.map((o) => `${dir}/${o.name}`).filter((fullPath) => fullPath !== keepKey);

  if (toRemove.length) {
    await supabase.storage.from(BUCKET_NAME).remove(toRemove);
  }
}

export async function removeByPublicUrl(publicUrl: string) {
  const clean = publicUrl.split('#')[0].split('?')[0];
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const idx = clean.indexOf(marker);
  if (idx === -1) {
    throw new Error('URL pública inválida: no se pudo resolver el key');
  }

  const keyEncoded = clean.slice(idx + marker.length); // "profiles/.../file.jpg"
  const key = decodeURIComponent(keyEncoded);

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([key]);
  if (error) throw error;
}
