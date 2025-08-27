import i18next from 'i18next';
import { z } from 'zod';

export const creaditSchema = z.object({
  id: z.string().optional(),
  productionTypeId: z.string().min(1, i18next.t('validation.required')),
  projectName: z.string().trim().min(1, i18next.t('validation.required')),
  producerName: z.string().trim().min(1, i18next.t('validation.required')),
  role: z.string().trim().min(1, i18next.t('validation.required')),
  year: z.string().min(1, 'Requerido').regex(/^\d+$/, i18next.t('validation.number')),
});
