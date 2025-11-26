import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ForgottenPasswordForm } from '.';
import { useModal } from '../../../context/ModalContext';
import { ROUTES } from '../../../shared/lib/routes';
import { useLoginMutation } from '../hooks/useLoginMutation';
import { getLoginSchema, type LoginFormValues } from '../schemas/authSchema';

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const loginMutation = useLoginMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  const handleForgottenPass = () => {
    openModal(<ForgottenPasswordForm />, t('auth.page.forgotten_pass'), 'lg');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginSchema()),
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);
    loginMutation.mutate(data, {
      onError: (err: any) => {
        const message = err?.response?.data?.message || t('state.server_err');
        setServerError(message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FormInputField
        id="email"
        placeholder={t('auth.login.email')}
        type="email"
        error={errors.email?.message}
        autoComplete="email"
        {...register('email')}
      />
      <FormInputField
        id="password"
        placeholder={t('auth.login.password')}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex justify-end text-sm">
        <h2 className="cursor-pointer hover:underline transition-all duration-300" onClick={handleForgottenPass}>
          {t('auth.page.forgotten_pass')}
        </h2>
      </div>

      <Button type="submit" className="mt-4 mb-2 cursor-pointer">
        {loginMutation.isPending ? t('state.loading') : t('auth.login.submit')}
      </Button>

      {serverError && (
        <Label variant="error" className="pl-1">
          {serverError}
        </Label>
      )}

      <h2 className="mb-6 text-xs font-light text-center">
        {t('auth.page.disclaimer_terms_login')}{' '}
        <Link to={ROUTES.TERMS} className="font-semibold text-[var(--color-primary-purple)]">
          {t('legal.short_terms')}
        </Link>{' '}
        {t('general.and')}{' '}
        <Link to={ROUTES.PRIVACY} className="font-semibold text-[var(--color-primary-purple)]">
          {t('legal.short_privacy')}
        </Link>
      </h2>

      <div className="flex text-sm font-light gap-2 mt-2">
        <h2>{t('auth.page.create_acc')}</h2>
        <span className="font-semibold cursor-pointer text-[var(--color-primary-purple)]" onClick={onSwitch}>
          {t('auth.page.create_acc_cta')}
        </span>
      </div>
    </form>
  );
}
