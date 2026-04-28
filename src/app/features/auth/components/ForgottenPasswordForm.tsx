import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Separator } from 'autocasting-ui-library-padimasso';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../context/ModalContext';
import { useToast } from '../../../context/ToastContext';
import { handleBackendFormError } from '../../../shared/utils/backendErrorHandling';
import { useForgotPasswordMutation } from '../hooks/useForgotPasswordMutation';
import { getForgottenPasswordSchema, type ForgottenPasswordValues } from '../schemas/authSchema';

export default function ForgottenPasswordForm() {
  const { openModal, closeModal } = useModal();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgottenPasswordValues>({
    resolver: zodResolver(getForgottenPasswordSchema()),
  });

  const handleSuccessModal = () => {
    openModal(<EmailSentModal />, t('auth.forgotten_password.email_sent_title'), 'lg');
  };

  const onSubmit = (data: ForgottenPasswordValues) => {
    clearErrors();
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        closeModal();
        handleSuccessModal();
      },
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
            'server_error.auth.user_not_found': 'email',
          },
          generalFieldFallback: 'email',
        });
      },
    });
  };

  return (
    <article className="flex flex-col gap-6">
      <p className="text-base">{t('auth.forgotten_password.text')}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          id="email"
          placeholder={t('auth.login.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Separator className="opacity-20 mt-6 mb-10" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeModal}>
            {t('buttons.cancel')}
          </Button>
          <Button type="submit" loading={forgotPasswordMutation.isPending}>
            {t('auth.forgotten_password.submit')}
          </Button>
        </div>
      </form>
    </article>
  );
}

const EmailSentModal = () => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  return (
    <article className="flex flex-col gap-4">
      <p className="text-base">{t('auth.forgotten_password.email_sent_text')}</p>
      <p className="text-base">{t('auth.forgotten_password.email_sent_text_2')}</p>
      <Separator className="opacity-20 my-6" />
      <div className="flex gap-2 items-center">
        <Button type="submit" onClick={closeModal}>
          {t('general.accept')}
        </Button>
      </div>
    </article>
  );
};
