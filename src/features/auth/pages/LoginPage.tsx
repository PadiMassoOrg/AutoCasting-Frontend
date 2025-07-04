import { useTranslation } from 'react-i18next';
import { Layout } from '../../../shared/components/Layouts';
import LoginForm from '../components/LoginForm';
import { GoogleButton } from 'autocasting-ui-library-padimasso';
import { Logo } from '../../../shared/components/Logo';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="flex flex-col gap-4 items-center pb-8">
        <Logo></Logo>
        <h2 className="font-bold text-2xl whitespace-nowrap">{t('company.header')}</h2>
      </div>
      <GoogleButton className="cursor-pointer">{t('auth.login.google')}</GoogleButton>
      <div className="w-full relative flex justify-between items-center py-6">
        <hr className="opacity-20 w-full" />
        <p className="text-sm mx-4 whitespace-nowrap">{t('auth.page.or_login_with')}</p>
        <hr className="opacity-20 w-full" />
      </div>
      <LoginForm />
    </Layout>
  );
}
