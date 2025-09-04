import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation';
import { getResetPasswordSchema, type ResetPasswordValues } from '../schemas/authSchema';

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
        onError: (err: any) => {
          const message = err?.response?.data?.message || t('state.server_err');
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
        {resetPasswordMutation.isPending ? t('state.loading') : t('auth.login.submit')}
      </Button>
      {serverError && (
        <Label variant="error" className="pl-1">
          {serverError}
        </Label>
      )}
    </form>
  );
};

export default ResetPasswordForm;
