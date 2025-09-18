import type { TFunction } from 'i18next';
import { z } from 'zod';

const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getBasicInfoSchema(t: TFunction, yearStart: number, yearEnd: number) {
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

  const year = z
    .string()
    .refine((y) => /^\d{4}$/.test(y), { message: t('validation.year_invalid') })
    .refine(
      (y) => {
        const n = Number(y);
        return n >= yearStart && n <= yearEnd;
      },
      { message: t('validation.year_out_of_range', { min: yearStart, max: yearEnd }) }
    );

  const month = z.string().refine((m) => /^(0[1-9]|1[0-2])$/.test(m), { message: t('validation.month_invalid') });

  const day = z.string().refine((d) => /^(0[1-9]|[12]\d|3[01])$/.test(d), { message: t('validation.day_invalid') });

  const birth = z.object({ year, month, day }).superRefine(({ year, month, day }, ctx) => {
    const yy = Number(year),
      mm = Number(month),
      dd = Number(day);
    const dt = new Date(yy, mm - 1, dd);
    const isReal = dt.getFullYear() === yy && dt.getMonth() + 1 === mm && dt.getDate() === dd;
    if (!isReal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['day'],
        message: t('validation.date_invalid'),
      });
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['month'], message: t('validation.date_invalid') });
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['year'], message: t('validation.date_invalid') });
    }
  });

  const professions = z.array(z.string().regex(UUID_RX));

  return z.object({
    stageName,
    genderId,
    birth,
    professions,
  });
}
