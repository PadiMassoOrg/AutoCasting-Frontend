import type { TFunction } from 'i18next';
import { z } from 'zod';
import { NAME_RX, UUID_RX } from '../../../../shared/utils/schemaUtils';

export function getCastingBasicInfoSchema(t: TFunction) {
  const optionalUuid = z
    .string()
    .trim()
    .regex(UUID_RX, { message: t('validation.uuid_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  const optionalShortText = z
    .string()
    .trim()
    .max(255, { message: t('validation.max_char') })
    .optional();

  const optionalIsoDate = z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: t('validation.invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

  const title = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .max(255, { message: t('validation.max_char') })
    .regex(NAME_RX, { message: t('validation.invalid') });

  return z.object({
    title,
    projectTypeId: optionalUuid,
    castingModalityId: optionalUuid,
    locationText: optionalShortText,
    applicationDeadline: optionalIsoDate,
    hasWardrobeFitting: z.boolean().nullable().optional(),
    wardrobeFittingText: optionalShortText,
    shootingStartDate: optionalIsoDate,
    shootingEndDate: optionalIsoDate,
    description: z
      .string()
      .trim()
      .max(3000, { message: t('validation.max_char') })
      .optional(),
  });
}
