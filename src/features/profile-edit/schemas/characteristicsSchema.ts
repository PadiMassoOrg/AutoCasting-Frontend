import type { TFunction } from 'i18next';
import { z } from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LETTERS_1_2_RX = /^[A-Za-z]{1,3}$/;
const DIGITS_1_3_RX = /^\d{1,3}$/;

const buildInt20to300 = (t: TFunction) =>
  z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z
      .number({ invalid_type_error: t('validation.number') })
      .int({ message: t('validation.number') })
      .min(20, { message: t('validation.invalid') })
      .max(300, { message: t('validation.invalid') })
  );

const buildOptionalInt20to300 = (t: TFunction) =>
  z
    .union([buildInt20to300(t), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v === '' || v == null ? undefined : (v as number)));

const buildOptionalUuid = (t: TFunction) =>
  z
    .string()
    .trim()
    .regex(UUID_RX, { message: t('validation.uuid_invalid') })
    .optional()
    .or(z.literal('').transform(() => undefined));

const lettersOr3DigitsOptional = (t: TFunction) =>
  z
    .string()
    .trim()
    .transform((s) => (s === '' ? undefined : s))
    .refine((s) => s === undefined || LETTERS_1_2_RX.test(s) || DIGITS_1_3_RX.test(s), {
      message: t('validation.invalid'),
    })
    .optional();

export const buildMeasureNumOrText = lettersOr3DigitsOptional;

const buildSizeOrTextOptional = lettersOr3DigitsOptional;

export const getCharacteristicsSchema = (t: TFunction) =>
  z.object({
    heightCm: buildOptionalInt20to300(t),
    weightKg: buildOptionalInt20to300(t),
    hairColorId: buildOptionalUuid(t),
    eyeColorId: buildOptionalUuid(t),
    chestCm: buildMeasureNumOrText(t),
    waistCm: buildMeasureNumOrText(t),
    hipCm: buildMeasureNumOrText(t),
    shirtSize: buildSizeOrTextOptional(t),
    pantSize: buildSizeOrTextOptional(t),
    dressSize: buildSizeOrTextOptional(t),
    shoeSize: buildSizeOrTextOptional(t),
    tattoo: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]).optional(),
    passport: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]).optional(),
    drivingLicense: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]).optional(),
    dietOptionId: buildOptionalUuid(t),
  });

export type CharacteristicsValues = z.infer<ReturnType<typeof getCharacteristicsSchema>>;
