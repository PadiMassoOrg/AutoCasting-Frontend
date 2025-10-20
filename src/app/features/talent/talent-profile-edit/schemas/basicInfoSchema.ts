import type { TFunction } from 'i18next';
import { z } from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getBasicInfoSchema(t: TFunction) {
  const stageName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

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
