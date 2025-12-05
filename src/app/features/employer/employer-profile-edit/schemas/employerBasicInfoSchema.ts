import type { TFunction } from 'i18next';
import { z } from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getEmployerBasicInfoSchema(t: TFunction) {
  const companyName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

  const taxNumber = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

  const companyTypeId = z
    .string()
    .trim()
    .regex(UUID_RX, { message: t('validation.uuid_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  const companyEmail = z
    .string()
    .trim()
    .email({ message: t('validation.email_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  const address = z.string().trim().optional();

  const websiteUrl = z.string().trim().optional();

  const about = z.string().trim().optional();

  return z.object({
    companyName,
    taxNumber,
    companyTypeId,
    companyEmail,
    address,
    websiteUrl,
    about,
  });
}
