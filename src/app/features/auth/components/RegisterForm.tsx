import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Label } from 'autocasting-ui-library-padimasso';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { getRegisterSchema, type RegisterFormValues } from '../schemas/authSchema';

type RegisterFormProps = {
  onSwitch: () => void;
  role: string;
};

export default function RegisterForm({ onSwitch, role }: RegisterFormProps) {
  const { t } = useTranslation();
  const registerMutation = useRegisterMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(getRegisterSchema()),
    defaultValues: {
      role,
    },
  });

  useEffect(() => {
    if (role) {
      setValue('role', role, { shouldValidate: true });
    }
  }, [role, setValue]);

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);
    registerMutation.mutate(data, {
      onError: (err: any) => {
        const message = err?.response?.data?.message || t('state.server_err');
        setServerError(message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-0.5">
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

      <Button type="submit" className="mt-5 cursor-pointer">
        {registerMutation.isPending ? t('state.loading') : t('auth.register.submit')}
      </Button>

      {serverError && (
        <div className="text-center">
          <Label variant="error">{serverError}</Label>
        </div>
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
