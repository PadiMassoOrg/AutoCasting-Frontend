import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField } from 'autocasting-ui-library-padimasso';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { useToast } from '../../../context/ToastContext';
import { ROUTES } from '../../../shared/lib/routes';
import { handleBackendFormError } from '../../../shared/utils/backendErrorHandling';
import ChangePasswordSuccessModal from '../../talent/talent-profile-settings/components/ChangePasswordSuccessModal';
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation';
import { getResetPasswordSchema, type ResetPasswordValues } from '../schemas/authSchema';

const ResetPasswordForm = ({ token }: { token: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const resetPasswordMutation = useResetPasswordMutation();
  const { openModal, closeModal } = useModal();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(getResetPasswordSchema()),
  });

  const handleClose = () => {
    closeModal();
    navigate(ROUTES.AUTH);
  };

  const handleSuccessModal = () => {
    openModal(
      <ChangePasswordSuccessModal onClose={handleClose} />,
      t('settings.page.account.change_pass_modal.success'),
      'lg'
    );
  };

  const onSubmit = async (data: ResetPasswordValues) => {
    clearErrors();
    resetPasswordMutation.mutate(
      {
        token: token,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
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
            fieldMap: {
              newPassword: 'password',
            },
            messageFieldMap: {
              'server_error.auth.invalid_token': 'password',
              'server_error.auth.token_expired': 'password',
              'server_error.auth.password_reset_external': 'password',
            },
            generalFieldFallback: 'password',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-2">
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
        {resetPasswordMutation.isPending ? t('state.loading') : t('general.save')}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
