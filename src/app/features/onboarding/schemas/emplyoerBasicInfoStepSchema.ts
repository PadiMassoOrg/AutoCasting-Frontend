import type { TFunction } from 'i18next';
import { z } from 'zod';
import { capitalizeIfShouting } from '../../../shared/utils/formatUtils';
import { NAME_RX } from '../../../shared/utils/schemaUtils';

export function getEmployerBasicInfoSchema(t: TFunction) {
  const companyName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .max(255, { message: t('validation.max_char') })
    .regex(NAME_RX, { message: t('validation.invalid') })
    .transform(capitalizeIfShouting);

  return z.object({
    companyName,
  });
}

export type EmployerBasicInfoValues = z.infer<ReturnType<typeof getEmployerBasicInfoSchema>>;
