import { useForm } from 'react-hook-form';
import { Button, FormInputField } from 'autocasting-ui-library-padimasso';
import { useModal } from '../../../context/ModalContext';
import { useTranslation } from 'react-i18next';
import { getForgottenPassSchema } from '../schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ForgottenPasswordForm() {
  const { closeModal } = useModal();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getForgottenPassSchema()),
  });

  const onSubmit = (data: { email: string }) => {
    alert(data.email);
    closeModal();
  };

  return (
    <article className="flex flex-col gap-6">
      <p className="text-base" style={{ fontFamily: 'var(--font-serif)' }}>
        {t('auth.forgotten_pass.text')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInputField
          id="email"
          placeholder={t('auth.login.email')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <hr className="opacity-20 mt-6 mb-10" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeModal}>
            {t('general.buttons.cancel')}
          </Button>
          <Button type="submit">{t('auth.forgotten_pass.submit')}</Button>
        </div>
      </form>
    </article>
  );
}
