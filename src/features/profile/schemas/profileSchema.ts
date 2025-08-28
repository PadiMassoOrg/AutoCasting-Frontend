// schemas/profileSchema.ts
import i18next from 'i18next';
import { z, type ZodErrorMap, ZodIssueCode } from 'zod';

// Se ejecuta en import-time, pero el .t() se usará en runtime durante la validación.
const zodI18nErrorMap: ZodErrorMap = (issue, ctx) => {
  const t = i18next.t.bind(i18next);

  switch (issue.code) {
    case ZodIssueCode.invalid_string:
      // Para regex → "solo números"
      if (issue.validation === 'regex') {
        return { message: t('validation.number') };
      }
      return { message: ctx.defaultError };

    case ZodIssueCode.too_small:
      // .min(1) en string → "Campo obligatorio"
      if (issue.type === 'string') {
        return { message: t('validation.required') };
      }
      return { message: ctx.defaultError };

    case ZodIssueCode.invalid_type:
      // Si esperábamos string pero vino vacío/undefined, tratamos como requerido
      if (issue.expected === 'string') {
        return { message: t('validation.required') };
      }
      return { message: ctx.defaultError };

    default:
      return { message: ctx.defaultError };
  }
};

z.setErrorMap(zodI18nErrorMap);

export const creaditSchema = z.object({
  id: z.string().optional(),
  productionTypeId: z.string().min(1),
  projectName: z.string().trim().min(1),
  producerName: z.string().trim().min(1),
  role: z.string().trim().min(1),
  year: z.string().min(1).regex(/^\d+$/), // solo números
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1),
  courseName: z.string().trim().min(1),
  graduationYear: z.string().min(1).regex(/^\d+$/),
});
