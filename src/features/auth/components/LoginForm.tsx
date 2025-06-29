import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLoginSchema } from '../schemas/loginSchema';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../hooks/useLoginMutation';
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
    setServerError(null);
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        localStorage.setItem('authToken', data.token);
      },
      onError: (err: any) => {
        const message = err?.response?.data?.message || 'Unexpected server error';
        console.log(message);
        setServerError(message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <FormInputField
        id="email"
        placeholder={t('auth.login.email')}
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormInputField
        id="password"
        placeholder={t('auth.login.password')}
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <h2 className="flex justify-end text-sm cursor-pointer hover:underline transition-all duration-300">
        {t('auth.page.forgotten_pass')}
      </h2>
      <Button type="submit" className="my-2">
        {loginMutation.isPending ? t('general.state.loading') : t('auth.login.submit')}
      </Button>
      {serverError && <div className="text-red-600 text-sm text-center">{serverError}</div>}
      <div className="flex text-sm gap-2 mt-2">
        <h2>{t('auth.page.create_acc')}</h2>
        <span className="font-bold cursor-pointer">{t('auth.page.create_acc_cta')}</span>
      </div>
    </form>
  );
}
