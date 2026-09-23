import { useMutation } from '@tanstack/react-query';
import { SUPABASE } from '../../constants';
import { assertImageSourceSize, isHeicImage, optimizeImageForUpload } from '../lib/imageOptimization';
import { uploadPublic } from '../lib/profile-media';

type MutationArgs = { file: File };

function getExt(name: string, type?: string) {
  const byName = name?.split('.').pop();
  if (byName && byName.length <= 5) return byName.toLowerCase();
  if (type?.includes('/')) return type.split('/')[1];
  return 'bin';
}

function buildStorageKey(employerProfileId: string, castingId: string, file: File) {
  const ext = getExt(file.name, file.type);
  const ts = Date.now();
  return `${SUPABASE.EMPLOYER_BUCKET}/${employerProfileId}/${SUPABASE.CASTING_BUCKET}/${castingId}/${SUPABASE.ROLE_REFERENCE_PHOTO}/${ts}.${ext}`;
}

/**
 * Uploads a casting role's reference photo to Supabase Storage and returns its public URL.
 * Unlike profile/employer media, casting roles have no dedicated PATCH-photo endpoint — the
 * returned URL is just set on the role's draft (CastingRoleForm) and persisted together with
 * the rest of the role on save (see toCastingRoleRequest), so this hook only uploads, it never
 * calls the roles API itself.
 *
 * It also never deletes the previous photo — a role's draft can be discarded (switch roles,
 * cancel) without ever being saved, so deleting eagerly here could remove a file that's still
 * referenced by the persisted role. The caller (CastingRoleForm) queues the old URL and the
 * actual Supabase deletion only runs once the role save succeeds.
 */
export function useCastingRolePhotoUpload(employerProfileId: string, castingId: string) {
  return useMutation<string, unknown, MutationArgs>({
    mutationFn: async ({ file }) => {
      if (!file.type.startsWith('image/') && !isHeicImage(file)) throw new Error('validation.type_image');
      assertImageSourceSize(file);

      const optimizedFile = await optimizeImageForUpload(file, 'casting-role-photo');

      const key = buildStorageKey(employerProfileId, castingId, optimizedFile);
      const { publicUrl } = await uploadPublic(key, optimizedFile);

      return publicUrl;
    },
  });
}
