import type { TFunction } from 'i18next';
import { z } from 'zod';
import { NAME_RX, TAX_NUMBER_RX } from '../../../shared/utils/schemaUtils';

export function getEmployerBasicInfoSchema(t: TFunction) {
  const companyName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .max(255, { message: t('validation.max_char') })
    .regex(NAME_RX, { message: t('validation.invalid') });

  const taxNumber = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .max(255, { message: t('validation.max_char') })
    .regex(TAX_NUMBER_RX, { message: t('validation.invalid') });

  return z.object({
    companyName,
    taxNumber,
  });
}

export type EmployerBasicInfoValues = z.infer<ReturnType<typeof getEmployerBasicInfoSchema>>;
