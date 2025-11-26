import i18next from 'i18next';
import { z } from 'zod';

export const getLoginSchema = () => {
  return z.object({
    email: z.string().email({
      message: i18next.t('auth.validation.email'),
    }),
    password: z.string().min(6, {
      message: i18next.t('auth.validation.password_min'),
    }),
  });
};

export const getRegisterSchema = () => {
  return z.object({
    email: z.string().email({
      message: i18next.t('auth.validation.email'),
    }),
    password: z.string().min(6, {
      message: i18next.t('auth.validation.password_min'),
    }),
  });
};

export const getForgottenPasswordSchema = () => {
  return z.object({
    email: z.string().email({
      message: i18next.t('auth.validation.email'),
    }),
  });
};

export const getResetPasswordSchema = () => {
  return z
    .object({
      password: z.string().min(6, {
        message: i18next.t('auth.validation.password_min'),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18next.t('auth.validation.password_missmatch'),
      path: ['confirmPassword'],
    });
};

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>;
export type ForgottenPasswordValues = z.infer<ReturnType<typeof getForgottenPasswordSchema>>;
export type ResetPasswordValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;
