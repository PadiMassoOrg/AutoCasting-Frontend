import i18next from 'i18next';
import z from 'zod';

export const getChangePasswordSchema = () => {
  return z
    .object({
      oldPassword: z.string().min(6, {
        message: i18next.t('auth.validation.password_min'),
      }),
      newPassword: z.string().min(6, {
        message: i18next.t('auth.validation.password_min'),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: i18next.t('auth.validation.password_missmatch'),
      path: ['confirmPassword'],
    });
};

export type ChangePasswordValues = z.infer<ReturnType<typeof getChangePasswordSchema>>;
