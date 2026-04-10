import type { TFunction } from 'i18next';
import { z } from 'zod';
import { NAME_RX } from '../../../shared/utils/schemaUtils';

export function getTalentBasicInfoSchema(t: TFunction) {
  const stageName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') })
    .max(255, { message: t('validation.max_char') })
    .regex(NAME_RX, { message: t('validation.invalid') });

  return z.object({
    stageName,
  });
}

export type TalentBasicInfoValues = z.infer<ReturnType<typeof getTalentBasicInfoSchema>>;
