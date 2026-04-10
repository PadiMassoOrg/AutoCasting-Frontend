import type { TFunction } from 'i18next';
import { z } from 'zod';
import { NAME_RX, UUID_RX } from '../../../../shared/utils/schemaUtils';

export function getBasicInfoSchema(t: TFunction) {
  const stageName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .max(255, { message: t('validation.max_char') })
    .regex(NAME_RX, { message: t('validation.invalid') });

  const genderId = z
    .string()
    .trim()
    .regex(UUID_RX, { message: t('validation.uuid_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  const professions = z.array(z.string().regex(UUID_RX));

  return z.object({
    stageName,
    genderId,
    professions,
  });
}
