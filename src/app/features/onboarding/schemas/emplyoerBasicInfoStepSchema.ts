import type { TFunction } from 'i18next';
import { z } from 'zod';

export function getEmployerBasicInfoSchema(t: TFunction) {
  const companyName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

  const taxNumber = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

  return z.object({
    companyName,
    taxNumber,
  });
}

export type EmployerBasicInfoValues = z.infer<ReturnType<typeof getEmployerBasicInfoSchema>>;
