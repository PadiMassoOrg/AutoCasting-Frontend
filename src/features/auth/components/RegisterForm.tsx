import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRegisterSchema, type RegisterFormValues } from '../schemas/authSchema';
import { useTranslation } from 'react-i18next';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { FormInputField, Button, Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { t } = useTranslation();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(getRegisterSchema()),
    defaultValues: {
      role: 'ACTOR',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);

    // TODO - Manejo de ACTOR o CASTINERA

    registerMutation.mutate(data, {
      onError: (err: any) => {
        const message = err?.response?.data?.message || t('state.server_err');
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
        {registerMutation.isPending ? t('state.loading') : t('auth.register.submit')}
      </Button>
      {serverError && (
        <Label variant="error" className="pl-1">
          {serverError}
        </Label>
      )}
      <div className="flex text-sm gap-2 mt-2">
        <h2>{t('auth.page.login_acc')}</h2>
        <span className="font-bold cursor-pointer" onClick={onSwitch}>
          {t('auth.page.login_acc_cta')}
        </span>
      </div>
    </form>
  );
}
