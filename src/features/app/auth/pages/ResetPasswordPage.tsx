import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NoNavigationLayout from '../../../../layouts/NoNavigationLayout';
import { LinkLogo } from '../../../../shared/components/LinkLogo';
import { ResetPasswordForm } from '../components';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth?error=invalid_token');
    }
  }, [token]);

  if (token)
    return (
      <NoNavigationLayout>
        <article
          className="
        w-full h-full m-auto flex flex-col bg-white max-w-lg
        lg:px-8 lg:py-20 lg:rounded-2xl lg:shadow-[0_0_8px_3px_rgba(0,0,0,0.06)]
        "
        >
          <div className="flex flex-col gap-4 items-center pb-8">
            <LinkLogo></LinkLogo>
          </div>
          <div className="w-full flex flex-col gap-10 items-center lg:items-start">
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-2xl whitespace-nowrap">{t('auth.reset_password.page.title')}</h2>
              <p className="text-sm">{t('auth.reset_password.page.p')}</p>
            </div>
            <ResetPasswordForm token={token}></ResetPasswordForm>
          </div>
        </article>
      </NoNavigationLayout>
    );
};

export default ResetPasswordPage;
