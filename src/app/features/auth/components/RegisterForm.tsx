import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField } from 'autocasting-ui-library-padimasso';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { ROUTES } from '../../../shared/lib/routes';
import { handleBackendFormError } from '../../../shared/utils/backendErrorHandling';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { getRegisterSchema, type RegisterFormValues } from '../schemas/authSchema';

type RegisterFormProps = {
  onSwitch: () => void;
};

export default function RegisterForm({ onSwitch }: RegisterFormProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(getRegisterSchema()),
  });

  const onSubmit = (data: RegisterFormValues) => {
    clearErrors();
    registerMutation.mutate(data, {
      onError: (err: any) => {
        handleBackendFormError({
          error: err,
          t,
          setError,
          showToast: (message) =>
            showToast({
              title: t('general.error'),
              description: message,
              type: 'danger',
            }),
          messageFieldMap: {
            'server_error.auth.user_exists': 'email',
          },
          generalFieldFallback: 'password',
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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

      <Button type="submit" className="my-2 cursor-pointer">
        {registerMutation.isPending ? t('state.loading') : t('auth.register.submit')}
      </Button>

      <h2 className="mb-6 text-xs font-light text-center">
        {t('auth.page.disclaimer_terms_register')}{' '}
        <Link to={ROUTES.TERMS} className="font-semibold text-[var(--color-primary-purple)]">
          {t('legal.short_terms')}
        </Link>{' '}
        {t('general.and')}{' '}
        <Link to={ROUTES.PRIVACY} className="font-semibold text-[var(--color-primary-purple)]">
          {t('legal.short_privacy')}
        </Link>
      </h2>

      <div className="flex text-sm font-light gap-2">
        <h2>{t('auth.page.login_acc')}</h2>
        <span className="font-semibold cursor-pointer text-[var(--color-primary-purple)]" onClick={onSwitch}>
          {t('auth.page.login_acc_cta')}
        </span>
      </div>
    </form>
  );
}
