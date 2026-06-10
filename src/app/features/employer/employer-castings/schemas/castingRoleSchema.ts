import type { TFunction } from 'i18next';
import { z } from 'zod';
import type { SiteMetadataObject } from '../../../sitemetadata/types/sitemetadata.types';
import { NAME_RX, UUID_RX } from '../../../../shared/utils/schemaUtils';

const requiredUuid = (t: TFunction) =>
  z.preprocess(
    (value) => (value == null ? '' : value),
    z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .regex(UUID_RX, { message: t('validation.uuid_invalid') })
  );

const optionalUuid = (t: TFunction) =>
  z.preprocess(
    (value) => (value == null ? '' : value),
    z
      .string()
      .trim()
      .regex(UUID_RX, { message: t('validation.uuid_invalid') })
      .optional()
      .or(z.literal(''))
  );

const requiredShortIntText = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .refine((value) => /^\d+$/.test(value), { message: t('validation.number_invalid') })
    .refine((value) => Number(value) >= 0 && Number(value) <= 99, { message: t('validation.number_invalid') });

const optionalAmountText = (t: TFunction) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || /^\d+$/.test(value), { message: t('validation.number_invalid') })
    .refine((value) => value === '' || Number(value) >= 0, { message: t('validation.number_invalid') });

const optionalText = (t: TFunction, max = 2000) =>
  z
    .string()
    .trim()
    .max(max, { message: t('validation.max_char') });

const getCastingRoleSchemaObject = (t: TFunction) =>
  z.object({
    roleName: z
      .string()
      .trim()
      .min(1, { message: t('validation.required') })
      .max(255, { message: t('validation.max_char') })
      .regex(NAME_RX, { message: t('validation.invalid') }),
    roleTypeId: requiredUuid(t),
    genderId: requiredUuid(t),
    ageMin: requiredShortIntText(t),
    ageMax: requiredShortIntText(t),
    professionIds: z
      .array(
        z
          .string()
          .trim()
          .min(1, { message: t('validation.required') })
          .regex(UUID_RX, { message: t('validation.uuid_invalid') })
      )
      .min(1, { message: t('validation.required') }),
    payRateTypeId: requiredUuid(t),
    currencyId: optionalUuid(t),
    amount: optionalAmountText(t),
    ethnicityId: optionalUuid(t),
    description: optionalText(t),
    remunerationNotes: optionalText(t),
    requirementDescription: optionalText(t, 3000),
  });

export const getCastingRoleSchema = (t: TFunction, payRateTypeOptions?: SiteMetadataObject[] | null) =>
  getCastingRoleSchemaObject(t).superRefine((data, ctx) => {
    if (Number(data.ageMin) > Number(data.ageMax)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ageMax'],
        message: t('validation.invalid'),
      });
    }

    const selectedPayRateTypeCode =
      payRateTypeOptions?.find((option) => option.id === data.payRateTypeId)?.stringCode ?? null;
    const amountRequired =
      selectedPayRateTypeCode != null &&
      !selectedPayRateTypeCode.endsWith('.unpaid') &&
      !selectedPayRateTypeCode.endsWith('.collaborative') &&
      !selectedPayRateTypeCode.endsWith('.cooperative');

    if (amountRequired && !data.amount.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['amount'],
        message: t('validation.required'),
      });
    }
  });
