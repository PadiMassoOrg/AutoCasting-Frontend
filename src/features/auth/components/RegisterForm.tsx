import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRegisterSchema } from '../schemas/authSchema';
import { useTranslation } from 'react-i18next';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { FormInputField, Button } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { setAuthToken } from '../../../shared/lib/cookies';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/lib/routes';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { t } = useTranslation();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getRegisterSchema()),
  });

  const onSubmit = (data: any) => {
    setServerError(null);
    // TODO - Manejo de ACTOR o CASTINERA
    data.role = 'ACTOR';
    registerMutation.mutate(data, {
      onSuccess: (data) => {
        setAuthToken(data.token);
        navigate(ROUTES.DASHBOARD);
      },
      onError: (err: any) => {
        const message = err?.response?.data?.message || t('general.state.server_err');
        setServerError(message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
      <FormInputField
        id="name"
        placeholder={t('auth.register.name')}
        type="text"
        error={errors.name?.message}
        autoComplete="name"
        {...register('name')}
      />
      <FormInputField
        id="email"
        placeholder={t('auth.register.email')}
        type="email"
        error={errors.email?.message}
        autoComplete="email"
        {...register('email')}
      />
      <FormInputField
        id="password"
        placeholder={t('auth.register.password')}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" className="mt-8 cursor-pointer">
        {registerMutation.isPending ? t('general.state.loading') : t('auth.register.submit')}
      </Button>
      {serverError && <div className="text-red-600 text-sm text-bold w-full mt-[-0.4rem] pl-0.5">{serverError}</div>}
      <div className="flex text-sm gap-2 mt-2">
        <h2>{t('auth.page.login_acc')}</h2>
        <span className="font-bold cursor-pointer" onClick={onSwitch}>
          {t('auth.page.login_acc_cta')}
        </span>
      </div>
    </form>
  );
}
