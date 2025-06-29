import { z } from 'zod';

export const getLoginSchema = (lang: 'en' | 'es') => {
  const messages = {
    en: {
      email: 'Invalid email address',
      password: 'Password must be at least 6 characters',
    },
    es: {
      email: 'Email inválido',
      password: 'La contraseña debe tener al menos 6 caracteres',
    },
  };

  return z.object({
    email: z.string().email({ message: messages[lang].email }),
    password: z.string().min(6, { message: messages[lang].password }),
  });
};

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;
