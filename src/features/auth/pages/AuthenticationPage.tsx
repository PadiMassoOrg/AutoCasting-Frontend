import { GoogleButton } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import AuthenticationLayout from '../../../layouts/AuthenticationLayout';
import { LinkLogo } from '../../../shared/components/LinkLogo';
import Resaltador from '../../../shared/lib/resaltador.svg';
import { RegisterForm } from '../components';
import LoginForm from '../components/LoginForm';
import { useGoogleLoginMutation } from '../hooks/useGoogleLoginMutation';

export default function AuthenticationPage() {
  const [login, setLogin] = useState(true);
  const { t } = useTranslation();
  const googleLoginMutation = useGoogleLoginMutation();

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate({ role: 'ACTOR' });
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-row items-center gap-36 w-full">
        {/* Banner */}
        <article className="hidden lg:flex flex-col gap-8 justify-center relative">
          <h2 className="font-extrabold text-4xl">
            ¡{t('auth.page.welcome')} <p className="break-after-all">{t('company.site')}!</p>
          </h2>
          <h2 className="text-neutral-600 opacity-65 font-normal text-lg">{t('auth.page.text_1')}</h2>
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
          <aside className="self-center mt-20">
            <LinkLogo></LinkLogo>
          </aside>
        </article>
        {/* Forms */}
        <article className="w-full h-full m-auto flex flex-col justify-center sm:max-w-md xl:max-w-lg lg:bg-white lg:px-8 lg:py-12 lg:rounded-2xl lg:shadow-lg ">
          <div className="flex flex-col gap-4 items-center pb-8">
            <LinkLogo></LinkLogo>
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
    </AuthenticationLayout>
  );
}
