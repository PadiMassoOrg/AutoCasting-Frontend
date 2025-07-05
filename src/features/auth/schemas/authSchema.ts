import { z } from 'zod';
import i18next from 'i18next';

export const getLoginSchema = () => {
  return z.object({
    email: z.string().email({
      message: i18next.t('general.validation.email'),
    }),
    password: z.string().min(6, {
      message: i18next.t('general.validation.password_min'),
    }),
  });
};

export const getRegisterSchema = () => {
  return z.object({
    name: z.string().min(1, {
      message: i18next.t('general.validation.name_min'),
    }),
    email: z.string().email({
      message: i18next.t('general.validation.email'),
    }),
    password: z.string().min(6, {
      message: i18next.t('general.validation.password_min'),
    }),
  });
};

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>;
