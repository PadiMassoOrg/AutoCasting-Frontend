import type { TFunction } from 'i18next';
import { z } from 'zod';
import { UUID_RX } from '../../../shared/utils/schemaUtils';
import type { CastingRequirement } from '../types/publicCasting.types';

const optionalUrl = (t: TFunction) =>
  z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^https?:\/\/\S+/i.test(v), { message: t('validation.url_invalid') });

export const getCastingApplicationSchema = (t: TFunction, requirements: CastingRequirement[]) =>
  z
    .object({
      message: z.string().trim().optional().or(z.literal('')),
      submissions: z.array(
        z.object({
          castingRequirementId: z.string().regex(UUID_RX, { message: t('validation.uuid_invalid') }),
          audioUrl: optionalUrl(t),
          videoUrl: optionalUrl(t),
          notes: z.string().trim().optional().or(z.literal('')),
        })
      ),
    })
    .superRefine((val, ctx) => {
      for (const req of requirements) {
        if (!req?.id) continue;
        const sub = val.submissions.find((s) => s.castingRequirementId === req.id);

        if (!sub) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.required'),
            path: ['submissions'],
          });
          continue;
        }

        if (req.requiresAudio && !sub.audioUrl?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.required'),
            path: ['submissions', val.submissions.indexOf(sub), 'audioUrl'],
          });
        }

        if (req.requiresVideo && !sub.videoUrl?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.required'),
            path: ['submissions', val.submissions.indexOf(sub), 'videoUrl'],
          });
        }
      }
    });

export type CastingApplicationFormValues = z.infer<ReturnType<typeof getCastingApplicationSchema>>;
export type CastingApplicationFormKey =
  | 'message'
  | `submissions.${number}.audioUrl`
  | `submissions.${number}.videoUrl`
  | `submissions.${number}.notes`;
