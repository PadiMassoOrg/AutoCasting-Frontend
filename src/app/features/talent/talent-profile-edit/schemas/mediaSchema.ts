import type { TFunction } from 'i18next';
import { z } from 'zod';

const MAX_MB = 8;
const MAX_BYTES = MAX_MB * 1024 * 1024;
export const OTHER_SLOTS = 2;
const VIDEO_HOST_WHITELIST = ['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'vimeo.com'] as const;

const isWhitelistedVideoHost = (hostname: string): boolean => {
  const normalizedHostname = hostname.toLowerCase();
  return VIDEO_HOST_WHITELIST.some(
    (allowedHost) => normalizedHostname === allowedHost || normalizedHostname.endsWith(`.${allowedHost}`)
  );
};

export const fileSchema = (t: TFunction) =>
  z
    .instanceof(File)
    .refine((f) => f.type.startsWith('image/'), { message: t('validation.media.type_image') })
    .refine((f) => f.size <= MAX_BYTES, { message: t('validation.media.max_size', { mb: MAX_MB }) });

export const otherIndexSchema = (t: TFunction) =>
  z
    .number({ invalid_type_error: t('validation.media.other_index_invalid') })
    .int({ message: t('validation.media.other_index_invalid') })
    .min(0, { message: t('validation.media.other_index_invalid') })
    .max(OTHER_SLOTS - 1, { message: t('validation.media.other_index_invalid') });

export async function getImageSizeFromFile(file: File): Promise<{ w: number; h: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    return { w: img.naturalWidth, h: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const urlFieldSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .superRefine((s, ctx) => {
      if (!s) return;
      try {
        const u = new URL(s);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
          return;
        }

        if (!isWhitelistedVideoHost(u.hostname)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.video_host_invalid') });
        }
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
      }
    });

export const getMediaVideosSchema = (t: TFunction) =>
  z.object({
    introductionVideoUrl: urlFieldSchema(t),
    showReelVideoUrl: urlFieldSchema(t),
  });

export type MediaVideosValues = z.infer<ReturnType<typeof getMediaVideosSchema>>;
