import { Trans, useTranslation } from 'react-i18next';
import { Layout } from '../../../shared/components/Layouts';
import LoginForm from '../components/LoginForm';
import { GoogleButton } from 'autocasting-ui-library-padimasso';
import { Logo } from '../../../shared/components/Logo';
import Resaltador from '../../../shared/lib/resaltador.svg';
import { useState } from 'react';
import { RegisterForm } from '../components';
import { useGoogleLoginMutation } from '../hooks/useGoogleLoginMutation';

export default function AuthenticationPage() {
  const [login, setLogin] = useState(true);
  const { t } = useTranslation();
  const googleLoginMutation = useGoogleLoginMutation();

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate({ state: 'ACTOR' });
  };

  return (
    <Layout>
      <div className="flex flex-row lg:h-[calc(100vh-10rem)] gap-36">
        {/* Banner */}
        <article
          className="hidden lg:flex h-full flex-col gap-8 mb-5 justify-center relative"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          <h2 className="font-extrabold text-5xl">
            ¡{t('auth.page.welcome')} <p className="break-after-all">{t('company.email')}!</p>
          </h2>
          <h2 className="text">{t('auth.page.text_1')}</h2>
          <ul className="list-disc pl-5">
            <li className="i18n" data-i18n="[html]content.body">
              <Trans i18nKey="auth.page.bullet_1" components={{ i: <i /> }} />
            </li>
            <li>
              <Trans i18nKey="auth.page.bullet_2" components={{ i: <i /> }} />
            </li>
            <li>
              <Trans i18nKey="auth.page.bullet_3" components={{ i: <i /> }} />
            </li>
          </ul>
          <div className="relative mt-12">
            <h2 className="font-bold pl-6 z-[20] relative">{t('auth.page.text_resaltador')}</h2>
            <img src={Resaltador} alt="higlight-text" className="absolute top-1/2  translate-y-[-55%] z-[0]" />
          </div>
          <aside className="absolute bottom-0 left-1/2">
            <Logo></Logo>
          </aside>
        </article>
        {/* Forms */}
        <article className="w-full m-auto lg:m-0 sm:max-w-sm lg:max-w-md xl:max-w-lg lg:bg-white lg:p-6 lg:rounded-2xl lg:shadow-lg lg:h-full lg:min-h-[45rem] flex flex-col justify-center">
          <div className="flex flex-col gap-4 items-center pb-8">
            <Logo />
            <h2 className="font-bold text-2xl whitespace-nowrap">{t('company.header')}</h2>
          </div>
          <GoogleButton className="cursor-pointer" onClick={handleGoogleLogin}>
            {t('auth.login.google')}
          </GoogleButton>
          <div className="w-full relative flex justify-between items-center py-6">
            <hr className="opacity-20 w-full" />
            <p className="text-sm mx-4 whitespace-nowrap">{t('auth.page.or_login_with')}</p>
            <hr className="opacity-20 w-full" />
          </div>
          {login ? <LoginForm onSwitch={() => setLogin(false)} /> : <RegisterForm onSwitch={() => setLogin(true)} />}
        </article>
      </div>
    </Layout>
  );
}
