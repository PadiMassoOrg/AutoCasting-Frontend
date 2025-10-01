import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormInputField, Label, Separator } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../context/ModalContext';
import { useChangePasswordMutation } from '../hooks/useChangePasswordMutation';
import { getChangePasswordSchema, type ChangePasswordValues } from '../schemas/accountSchema';
import ChangePasswordSuccessModal from './ChangePasswordSuccessModal';

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const { closeModal, openModal } = useModal();
  const changePasswordMutation = useChangePasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(getChangePasswordSchema()),
  });

  const handleSuccessModal = () => {
    openModal(<ChangePasswordSuccessModal />, t('account.page.change_pass_modal.success'), 'lg');
  };

  const onSubmit = async (data: ChangePasswordValues) => {
    setServerError(null);
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
          const message = err?.response?.data?.message || t('state.server_err');
          setServerError(message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <FormInputField
        id="oldPassword"
        type="password"
        label={t('account.page.change_pass_modal.actual_pass')}
        labelClassName="font-semibold"
        placeholder={t('********')}
        {...register('oldPassword')}
        error={errors.newPassword?.message}
      />
      <FormInputField
        id="password"
        type="password"
        label={t('account.page.change_pass_modal.new_pass')}
        labelClassName="font-semibold"
        placeholder={t('********')}
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />
      <FormInputField
        id="confirmPassword"
        type="password"
        placeholder={t('********')}
        label={t('account.page.change_pass_modal.repeat_new_pass')}
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
      {serverError && (
        <Label variant="error" className="pl-1">
          {serverError}
        </Label>
      )}
    </form>
  );
};

export default ChangePasswordForm;
