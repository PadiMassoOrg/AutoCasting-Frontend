import type { TFunction } from 'i18next';
import { z } from 'zod';
import { parseHttpUrl } from '../../../shared/utils/schemaUtils';
import type { CastingRequirement } from '../types/publicCasting.types';

const optionalUrl = (t: TFunction) =>
  z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || !!parseHttpUrl(v), { message: t('validation.url_invalid') });

export const getCastingApplicationSchema = (t: TFunction, requirements: CastingRequirement[]) =>
  z
    .object({
      message: z.string().trim().optional().or(z.literal('')),
      audioUrl: optionalUrl(t),
      videoUrl: optionalUrl(t),
      notes: z.string().trim().optional().or(z.literal('')),
    })
    .superRefine((val, ctx) => {
      const requiresAudio = requirements.some((req) => req?.requiresAudio);
      const requiresVideo = requirements.some((req) => req?.requiresVideo);

      if (requiresAudio && !val.audioUrl?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.required'),
          path: ['audioUrl'],
        });
      }

      if (requiresVideo && !val.videoUrl?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.required'),
          path: ['videoUrl'],
        });
      }
    });

export type CastingApplicationFormValues = z.infer<ReturnType<typeof getCastingApplicationSchema>>;
export type CastingApplicationFormKey = 'message' | 'audioUrl' | 'videoUrl' | 'notes';
