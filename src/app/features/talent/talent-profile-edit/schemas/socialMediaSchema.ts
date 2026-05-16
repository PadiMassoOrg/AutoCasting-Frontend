import type { TFunction } from 'i18next';
import { z } from 'zod';
import { parseHttpUrl, UUID_RX } from '../../../../shared/utils/schemaUtils';

const baseUrlField = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .superRefine((s, ctx) => {
      if (!parseHttpUrl(s)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('validation.url_invalid') });
      }
    });

export const getSocialMediaSchema = (t: TFunction) =>
  z.object({
    url: baseUrlField(t),
  });

export const getSocialMediaRowSchema = (t: TFunction) =>
  z.object({
    optionId: z
      .string({
        required_error: t('validation.required'),
        invalid_type_error: t('validation.required'),
      })
      .trim()
      .min(1, { message: t('validation.required') })
      .regex(UUID_RX, { message: t('validation.uuid_invalid') }),
    url: baseUrlField(t),
  });

export type SocialMediaValues = z.infer<ReturnType<typeof getSocialMediaSchema>>;
export type SocialMediaRowValues = z.infer<ReturnType<typeof getSocialMediaRowSchema>>;
export type SocialMediaRowFormKey = keyof SocialMediaRowValues;
