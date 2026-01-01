import type { TFunction } from 'i18next';
import { z } from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_TEXT_RX = /^[A-Za-zÀ-ÿ0-9 ]+$/;

export const getCastingRoleSchema = (t: TFunction) =>
  z
    .object({
      rolesSectionId: z
        .string({ required_error: t('validation.required') })
        .trim()
        .min(1, { message: t('validation.required') })
        .regex(UUID_RX, { message: t('validation.uuid_invalid') }),

      roleName: z
        .string()
        .trim()
        .min(1, { message: t('validation.required') })
        .max(50, { message: t('validation.invalid') })
        .regex(SAFE_TEXT_RX, { message: t('validation.invalid') }),

      roleType: z
        .string({ required_error: t('validation.required') })
        .trim()
        .min(1, { message: t('validation.required') })
        .regex(UUID_RX, { message: t('validation.uuid_invalid') }),

      gender: z
        .string({ required_error: t('validation.required') })
        .trim()
        .min(1, { message: t('validation.required') })
        .regex(UUID_RX, { message: t('validation.uuid_invalid') }),

      ageMin: z
        .number({ required_error: t('validation.required') })
        .int({ message: t('validation.number_invalid') })
        .min(0, { message: t('validation.number_invalid') })
        .max(99, { message: t('validation.number_invalid') }),

      ageMax: z
        .number({ required_error: t('validation.required') })
        .int({ message: t('validation.number_invalid') })
        .min(0, { message: t('validation.number_invalid') })
        .max(99, { message: t('validation.number_invalid') }),

      professionIds: z
        .array(
          z
            .string({ required_error: t('validation.required') })
            .trim()
            .min(1, { message: t('validation.required') })
            .regex(UUID_RX, { message: t('validation.uuid_invalid') })
        )
        .min(1, { message: t('validation.required') }),

      skillIds: z
        .array(
          z
            .string()
            .trim()
            .min(1, { message: t('validation.required') })
            .regex(UUID_RX, { message: t('validation.uuid_invalid') })
        )
        .optional(),

      description: z
        .string()
        .trim()
        .max(2000, { message: t('validation.invalid') })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.ageMin > data.ageMax) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ageMax'],
          message: t('validation.invalid'),
        });
      }
    });

export const getCastingRequirementSchema = (t: TFunction) =>
  z
    .object({
      requirementsSectionId: z
        .string({ required_error: t('validation.required') })
        .trim()
        .min(1, { message: t('validation.required') })
        .regex(UUID_RX, { message: t('validation.uuid_invalid') }),

      roleIds: z
        .array(
          z
            .string({ required_error: t('validation.required') })
            .trim()
            .min(1, { message: t('validation.required') })
            .regex(UUID_RX, { message: t('validation.uuid_invalid') })
        )
        .optional(),

      requiresAudio: z.boolean().default(false),
      requiresVideo: z.boolean().default(false),

      description: z
        .string()
        .trim()
        .max(2000, { message: t('validation.invalid') })
        .optional(),
    })
    .superRefine((data, ctx) => {
      const roles = data.roleIds ?? [];
      if (roles.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['roleIds'],
          message: t('validation.required'),
        });
      }

      const hasMedia = Boolean(data.requiresAudio) || Boolean(data.requiresVideo);
      if (!hasMedia) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['media'],
          message: t('validation.required'),
        });
      }
    });

export type CastingRoleFormValues = z.infer<ReturnType<typeof getCastingRoleSchema>>;
export type CastingRoleFormKey = keyof CastingRoleFormValues;

export type CastingRequirementFormValues = z.infer<ReturnType<typeof getCastingRequirementSchema>>;
export type CastingRequirementFormKey = keyof CastingRequirementFormValues | 'media';
