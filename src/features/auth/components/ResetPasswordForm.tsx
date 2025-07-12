import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getResetPasswordSchema, type ResetPasswordValues } from '../schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation';

const ResetPasswordForm = ({ token }: { token: string }) => {
  const { t } = useTranslation();
  const resetPasswordMutation = useResetPasswordMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(getResetPasswordSchema()),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setServerError(null);
    resetPasswordMutation.mutate(
      {
        token: token,
        newPassword: data.confirmPassword,
      },
      {
        onSuccess: (data) => {
          alert(data);
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message || t('general.state.server_err');
          setServerError(message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-20 space-y-4 p-4">
      <FormInputField
        id="password"
        type="password"
        placeholder={t('auth.reset_password.new')}
        {...register('password')}
        error={errors.password?.message}
      />
      <FormInputField
        id="confirmPassword"
        type="password"
        placeholder={t('auth.reset_password.repeat')}
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button type="submit" className="w-full">
        {resetPasswordMutation.isPending ? t('general.state.loading') : t('auth.login.submit')}
      </Button>
      {serverError && <div className="text-red-600 text-sm text-bold w-full mt-[-0.4rem] pl-0.5">{serverError}</div>}
    </form>
  );
};

export default ResetPasswordForm;
