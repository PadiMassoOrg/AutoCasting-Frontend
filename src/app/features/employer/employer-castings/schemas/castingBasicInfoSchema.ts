import type { TFunction } from 'i18next';
import { z } from 'zod';
import { NAME_RX, UUID_RX } from '../../../../shared/utils/schemaUtils';

export function getCastingBasicInfoSchema(t: TFunction) {
  const title = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .max(255, { message: t('validation.max_char') })
    .regex(NAME_RX, { message: t('validation.invalid') });

  const projectTypeId = z
    .string()
    .trim()
    .regex(UUID_RX, { message: t('validation.uuid_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  const castingModalityId = z
    .string()
    .trim()
    .regex(UUID_RX, { message: t('validation.uuid_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  return z.object({
    title,
    projectTypeId,
    castingModalityId,
  });
}
