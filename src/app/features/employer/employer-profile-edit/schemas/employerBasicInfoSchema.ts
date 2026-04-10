import type { TFunction } from 'i18next';
import { z } from 'zod';
import { NAME_RX, TAX_NUMBER_RX, UUID_RX } from '../../../../shared/utils/schemaUtils';

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
    .max(255, { message: t('validation.max_char') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  const address = z
    .string()
    .trim()
    .max(255, { message: t('validation.max_char') })
    .optional();

  const websiteUrl = z
    .string()
    .trim()
    .max(255, { message: t('validation.max_char') })
    .optional();

  const about = z
    .string()
    .trim()
    .max(255, { message: t('validation.max_char') })
    .optional();

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
