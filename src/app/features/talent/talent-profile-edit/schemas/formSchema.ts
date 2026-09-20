import type { TFunction } from 'i18next';
import { z } from 'zod';
import { capitalizeIfShouting, capitalizeWords } from '../../../../shared/utils/formatUtils';
import { NAME_RX, UUID_RX } from '../../../../shared/utils/schemaUtils';

export const getEducationSchema = (t: TFunction) =>
  z.object({
    institution: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(255, { message: t('validation.max_char') })
      .regex(NAME_RX, { message: t('validation.invalid') })
      .transform(capitalizeIfShouting),

    // Title-like field: always title-cased, not just when the input was ALL CAPS.
    courseName: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(255, { message: t('validation.max_char') })
      .regex(NAME_RX, { message: t('validation.invalid') })
      .transform(capitalizeWords),

    graduationYear: z
      .string()
      .trim()
      .max(255, { message: t('validation.max_char') })
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

    // Title-like field: always title-cased, not just when the input was ALL CAPS.
    projectName: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(255, { message: t('validation.max_char') })
      .regex(NAME_RX, { message: t('validation.invalid') })
      .transform(capitalizeWords),

    producerName: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(255, { message: t('validation.max_char') })
      .regex(NAME_RX, { message: t('validation.invalid') })
      .transform(capitalizeIfShouting),

    // Title-like field: always title-cased, not just when the input was ALL CAPS.
    role: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(255, { message: t('validation.max_char') })
      .regex(NAME_RX, { message: t('validation.invalid') })
      .transform(capitalizeWords),

    year: z
      .string()
      .trim()
      .max(255, { message: t('validation.max_char') })
      .regex(/^\d{4}$/, { message: t('validation.year_invalid') }),
  });

export type EducationFormValues = z.infer<ReturnType<typeof getEducationSchema>>;
export type EducationFormKey = keyof EducationFormValues;

export type CreditFormValues = z.infer<ReturnType<typeof getCreditSchema>>;
export type CreditFormKey = keyof CreditFormValues;
