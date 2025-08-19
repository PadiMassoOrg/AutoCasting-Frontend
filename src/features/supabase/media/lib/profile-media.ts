import { supabase } from '../../../../shared/lib/supabase';

const BUCKET = 'profile-media';

function extOf(file: File) {
  const e = file.name.split('.').pop() || 'bin';
  return e.toLowerCase();
}
function safeName(base: string) {
  return base.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
}
function uniqueName(kind: string, file: File) {
  const ts = Date.now();
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${kind}_${ts}_${rnd}.${extOf(file)}`;
}

/**
 * Opción A: bucket PÚBLICO
 * Sube y devuelve { publicUrl, path }.
 */
export async function uploadPublic(kind: 'headshot' | 'fullbody' | 'other', file: File, userId: string) {
  const path = `${safeName(userId)}/${uniqueName(kind, file)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}
