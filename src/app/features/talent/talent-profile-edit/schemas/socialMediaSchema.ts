import type { TFunction } from 'i18next';
import { z } from 'zod';

export const optionalUrlField = (t: TFunction) =>
  z
    .string()
    .trim()
    .superRefine((s, ctx) => {
      if (!s) return;
      try {
        const u = new URL(s);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
        }
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
      }
    });

export const optionalSocialUrlField = (t: TFunction, hosts: string[]) =>
  z
    .string()
    .trim()
    .superRefine((s, ctx) => {
      if (!s) return;
      try {
        const u = new URL(s);
        const protoOk = u.protocol === 'http:' || u.protocol === 'https:';
        const hostOk = hosts.some((h) => u.hostname === h || u.hostname.endsWith('.' + h));
        if (!protoOk || !hostOk) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
        }
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
      }
    });

export const getSocialMediaSchema = (t: TFunction, restrictHosts = true) => {
  const instaField = restrictHosts ? optionalSocialUrlField(t, ['instagram.com']) : optionalUrlField(t);

  const tiktokField = restrictHosts ? optionalSocialUrlField(t, ['tiktok.com']) : optionalUrlField(t);

  return z.object({
    instagramUrl: instaField,
    tikTokUrl: tiktokField,
  });
};

export type SocialMediaValues = z.infer<ReturnType<typeof getSocialMediaSchema>>;
