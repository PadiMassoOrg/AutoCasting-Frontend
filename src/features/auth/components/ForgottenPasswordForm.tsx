import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../context/ModalContext';
import { useForgotPasswordMutation } from '../hooks/useForgotPasswordMutation';
import { getForgottenPasswordSchema, type ForgottenPasswordValues } from '../schemas/authSchema';

export default function ForgottenPasswordForm() {
  const { closeModal } = useModal();
  const { t } = useTranslation();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgottenPasswordValues>({
    resolver: zodResolver(getForgottenPasswordSchema()),
  });

  const onSubmit = (data: ForgottenPasswordValues) => {
    setServerError(null);
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        closeModal();
      },
      onError: (err: any) => {
        const message = err?.response?.data?.message || t('state.server_err');
        setServerError(message);
      },
    });
  };

  return (
    <article className="flex flex-col gap-6">
      <p className="text-base">{t('auth.forgotten_password.text')}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <FormInputField
          id="email"
          placeholder={t('auth.login.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        {serverError && (
          <Label variant="error" className="pl-1">
            {serverError}
          </Label>
        )}
        <hr className="opacity-20 mt-6 mb-10" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeModal}>
            {t('buttons.cancel')}
          </Button>
          <Button type="submit">{t('auth.forgotten_password.submit')}</Button>
        </div>
      </form>
    </article>
  );
}
