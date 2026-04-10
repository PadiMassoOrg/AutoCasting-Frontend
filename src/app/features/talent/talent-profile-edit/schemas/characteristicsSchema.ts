import type { TFunction } from 'i18next';
import { z } from 'zod';
import { UUID_RX } from '../../../../shared/utils/schemaUtils';

const LETTERS_1_2_RX = /^[A-Za-z]{1,3}$/;
const DIGITS_1_3_RX = /^\d{1,3}$/;

/**
 * Nullable integer validator that preserves null/undefined distinction
 * @param t Translation function
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 */
const buildOptionalInt = (t: TFunction, min: number, max: number) =>
  z.union([
    z.literal('').transform(() => null),
    z.null(),
    z.undefined().transform(() => undefined),
    z
      .number()
      .int({ message: t('validation.number') })
      .min(min, { message: t('validation.invalid') })
      .max(max, { message: t('validation.invalid') }),
  ]);

/**
 * Nullable UUID validator
 */
const buildOptionalUuid = (t: TFunction) =>
  z
    .string()
    .trim()
    .regex(UUID_RX, { message: t('validation.uuid_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

/**
 * Nullable string validator that preserves null/undefined distinction for measures and sizes
 * @param t Translation function
 * @param pattern Optional regex pattern to validate (e.g., /^[A-Za-z]{1,3}$/)
 */
const buildOptionalString = (t: TFunction, pattern?: RegExp) =>
  z.union([
    z.literal('').transform(() => null),
    z.null(),
    z.undefined().transform(() => undefined),
    z
      .string()
      .trim()
      .refine((s) => !pattern || pattern.test(s), {
        message: t('validation.invalid'),
      }),
  ]);

export const getCharacteristicsSchema = (t: TFunction) =>
  z.object({
    heightCm: buildOptionalInt(t, 20, 300),
    weightKg: buildOptionalInt(t, 0, 500),

    hairColorId: buildOptionalUuid(t),
    eyeColorId: buildOptionalUuid(t),
    ethnicityId: buildOptionalUuid(t),

    chestCm: buildOptionalString(t, new RegExp(`${LETTERS_1_2_RX.source}|${DIGITS_1_3_RX.source}`)),
    waistCm: buildOptionalString(t, new RegExp(`${LETTERS_1_2_RX.source}|${DIGITS_1_3_RX.source}`)),
    hipCm: buildOptionalString(t, new RegExp(`${LETTERS_1_2_RX.source}|${DIGITS_1_3_RX.source}`)),

    shirtSize: buildOptionalString(t, new RegExp(`${LETTERS_1_2_RX.source}|${DIGITS_1_3_RX.source}`)),
    pantSize: buildOptionalString(t, new RegExp(`${LETTERS_1_2_RX.source}|${DIGITS_1_3_RX.source}`)),
    dressSize: buildOptionalString(t, new RegExp(`${LETTERS_1_2_RX.source}|${DIGITS_1_3_RX.source}`)),
    shoeSize: buildOptionalString(t, new RegExp(`${LETTERS_1_2_RX.source}|${DIGITS_1_3_RX.source}`)),

    tattoo: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]).optional(),
    passport: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]).optional(),
    drivingLicense: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]).optional(),

    dietOptionId: buildOptionalUuid(t),
  });

export type CharacteristicsValues = z.infer<ReturnType<typeof getCharacteristicsSchema>>;
