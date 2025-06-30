import { useTranslation } from 'react-i18next';
import { Layout } from '../../../shared/components/Layouts';
import LoginForm from '../components/LoginForm';
import { GoogleButton } from 'autocasting-ui-library-padimasso';
import { Logo } from '../../../shared/components/Logo';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="bg-white rounded-[20px] shadow p-8">
        <div className="flex flex-col gap-2 items-center pb-6">
          <Logo></Logo>
          <h2 className="font-bold text-2xl whitespace-nowrap">{t('company.header')}</h2>
        </div>
        <GoogleButton className="cursor-pointer">{t('auth.login.google')}</GoogleButton>
        <div className="w-full p-6 relative flex justify-between items-center">
          <hr className="opacity-20 w-[30%]" />
          <p className="text-sm">{t('auth.page.or_login_with')}</p>
          <hr className="opacity-20 w-[30%]" />
        </div>
        <LoginForm />
      </div>
    </Layout>
  );
}
