import type { TFunction } from 'i18next';
import { z } from 'zod';

export function getEmployerBasicInfoSchema(t: TFunction) {
  const name = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

  const cuit = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

  return z.object({
    name,
    cuit,
  });
}

export type EmployerBasicInfoValues = z.infer<ReturnType<typeof getEmployerBasicInfoSchema>>;
