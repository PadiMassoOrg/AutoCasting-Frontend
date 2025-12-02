import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Label } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { ROUTES } from '../../../shared/lib/routes';
import ChangePasswordSuccessModal from '../../talent/talent-profile-settings/components/ChangePasswordSuccessModal';
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation';
import { getResetPasswordSchema, type ResetPasswordValues } from '../schemas/authSchema';

const ResetPasswordForm = ({ token }: { token: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();
  const { openModal, closeModal } = useModal();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
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
    setServerError(null);
    resetPasswordMutation.mutate(
      {
        token: token,
        newPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          handleSuccessModal();
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message || t('state.server_err');
          setServerError(message);
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
      {serverError && (
        <Label variant="error" className="pl-1">
          {serverError}
        </Label>
      )}
    </form>
  );
};

export default ResetPasswordForm;
