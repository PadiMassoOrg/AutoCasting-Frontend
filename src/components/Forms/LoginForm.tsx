import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLoginSchema } from '../../schemas/loginSchema';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../../queries/authentication';
import { FormInputField, Button } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const { lang } = useLanguage();
  const { t } = useTranslation();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getLoginSchema(lang)),
  });

  const onSubmit = (data: any) => {
    setServerError(null); // Limpia errores anteriores
    loginMutation.mutate(data, {
      onError: (err: any) => {
        const message = err?.response?.data?.message || 'Unexpected server error';
        console.log(message);
        setServerError(message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInputField
        id="email"
        label={t('login.email')}
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormInputField
        id="password"
        label={t('login.password')}
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit">{loginMutation.isPending ? t('login.loading') : t('login.submit')}</Button>
      {serverError && <div className="text-red-600 text-sm text-center">{serverError}</div>}
    </form>
  );
}
