import type { TFunction } from 'i18next';
import { z } from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getCastingBasicInfoSchema(t: TFunction) {
  const title = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

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
