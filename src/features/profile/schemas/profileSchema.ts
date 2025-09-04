import i18next from 'i18next';
import { z, type ZodErrorMap, ZodIssueCode } from 'zod';

// TODO - Instanciar en FORM, no aqui.
const zodI18nErrorMap: ZodErrorMap = (issue, ctx) => {
  const t = i18next.t.bind(i18next);

  switch (issue.code) {
    case ZodIssueCode.invalid_string:
      if (issue.validation === 'regex') {
        return { message: t('validation.number') };
      }
      return { message: ctx.defaultError };

    case ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return { message: t('validation.required') };
      }
      return { message: ctx.defaultError };

    case ZodIssueCode.invalid_type:
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
  year: z.string().min(1).regex(/^\d+$/),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1),
  courseName: z.string().trim().min(1),
  graduationYear: z.string().min(1).regex(/^\d+$/),
});
