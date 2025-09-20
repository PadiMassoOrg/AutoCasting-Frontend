import type { TFunction } from 'i18next';
import { z } from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_TEXT_RX = /^[A-Za-zÀ-ÿ0-9 ]+$/;

export const getEducationSchema = (t: TFunction) =>
  z.object({
    institution: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(50, { message: t('validation.invalid') })
      .regex(SAFE_TEXT_RX, { message: t('validation.invalid') }),

    courseName: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(50, { message: t('validation.invalid') })
      .regex(SAFE_TEXT_RX, { message: t('validation.invalid') }),

    graduationYear: z
      .string()
      .trim()
      .regex(/^\d{4}$/, { message: t('validation.year_invalid') }),
  });

export const getCreditSchema = (t: TFunction) =>
  z.object({
    productionType: z
      .string({
        required_error: t('validation.required'),
        invalid_type_error: t('validation.required'),
      })
      .trim()
      .min(1, { message: t('validation.required') })
      .regex(UUID_RX, { message: t('validation.uuid_invalid') }),

    projectName: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(50, { message: t('validation.invalid') })
      .regex(SAFE_TEXT_RX, { message: t('validation.invalid') }),

    producerName: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(50, { message: t('validation.invalid') })
      .regex(SAFE_TEXT_RX, { message: t('validation.invalid') }),

    role: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(50, { message: t('validation.invalid') })
      .regex(SAFE_TEXT_RX, { message: t('validation.invalid') }),

    year: z
      .string()
      .trim()
      .regex(/^\d{4}$/, { message: t('validation.year_invalid') }),
  });

export type EducationFormValues = z.infer<ReturnType<typeof getEducationSchema>>;
export type EducationFormKey = keyof EducationFormValues;

export type CreditFormValues = z.infer<ReturnType<typeof getCreditSchema>>;
export type CreditFormKey = keyof CreditFormValues;
