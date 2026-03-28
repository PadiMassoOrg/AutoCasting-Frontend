import type { TFunction } from 'i18next';
import { z } from 'zod';

const baseUrlField = (t: TFunction) =>
  z
    .string()
    .trim()
    .superRefine((s, ctx) => {
      if (!s) return; // vacío = "sin validar / borrar"
      try {
        const u = new URL(s);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
        }
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
      }
    });

export const getSocialMediaSchema = (t: TFunction) =>
  z.object({
    url: baseUrlField(t), // 👈 ahora existe shape.url
  });

export type SocialMediaValues = z.infer<ReturnType<typeof getSocialMediaSchema>>;
