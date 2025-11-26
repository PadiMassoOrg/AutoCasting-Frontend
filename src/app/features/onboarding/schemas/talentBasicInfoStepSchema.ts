import type { TFunction } from 'i18next';
import { z } from 'zod';

export function getTalentBasicInfoSchema(t: TFunction) {
  const stageName = z
    .string()
    .trim()
    .min(1, { message: t('validation.required') });

  return z.object({
    stageName,
  });
}

export type TalentBasicInfoValues = z.infer<ReturnType<typeof getTalentBasicInfoSchema>>;
