import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Separator } from 'autocasting-ui-library-padimasso';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../context/ModalContext';
import { useToast } from '../../../../context/ToastContext';
import { handleBackendFormError } from '../../../../shared/utils/backendErrorHandling';
import { useChangePasswordMutation } from '../hooks/useChangePasswordMutation';
import { getChangePasswordSchema, type ChangePasswordValues } from '../schemas/accountSchema';
import ChangePasswordSuccessModal from './ChangePasswordSuccessModal';

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { closeModal, openModal } = useModal();
  const changePasswordMutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(getChangePasswordSchema()),
  });

  const handleSuccessModal = () => {
    openModal(
      <ChangePasswordSuccessModal onClose={closeModal} />,
      t('settings.page.account.change_pass_modal.success'),
      'lg'
    );
  };

  const onSubmit = async (data: ChangePasswordValues) => {
    clearErrors();
    changePasswordMutation.mutate(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
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
              'server_error.auth.invalid_credentials': 'oldPassword',
              'server_error.auth.current_password_mismatch': 'oldPassword',
            },
            generalFieldFallback: 'oldPassword',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <FormInputField
        id="oldPassword"
        type="password"
        label={t('settings.page.account.change_pass_modal.actual_pass')}
        labelClassName="font-semibold"
        placeholder={t('********')}
        {...register('oldPassword')}
        error={errors.oldPassword?.message}
      />
      <FormInputField
        id="password"
        type="password"
        label={t('settings.page.account.change_pass_modal.new_pass')}
        labelClassName="font-semibold"
        placeholder={t('********')}
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />
      <FormInputField
        id="confirmPassword"
        type="password"
        placeholder={t('********')}
        label={t('settings.page.account.change_pass_modal.repeat_new_pass')}
        labelClassName="font-semibold"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Separator className="opacity-20 my-4"></Separator>
      <div className="flex gap-2">
        <Button variant="outline" onClick={closeModal}>
          {t('buttons.cancel')}
        </Button>
        <Button type="submit" className="w-full">
          {changePasswordMutation.isPending ? t('state.loading') : t('general.save')}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
