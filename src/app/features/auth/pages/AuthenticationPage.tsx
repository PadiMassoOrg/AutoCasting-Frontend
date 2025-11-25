import { GoogleButton } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import NoNavigationLayout from '../../../layouts/NoNavigationLayout';
import { LinkLogo } from '../../../shared/components/LinkLogo';
import logo from '../../../shared/icons/og-image.svg';
import { useCachedSiteMetadataSlice } from '../../sitemetadata/hooks/useCachedSiteMetadata';
import { RegisterForm } from '../components';
import LoginForm from '../components/LoginForm';
import { useGoogleLoginMutation } from '../hooks/useGoogleLoginMutation';

export default function AuthenticationPage() {
  const { t } = useTranslation();
  const googleLoginMutation = useGoogleLoginMutation();
  const rolesRaw = useCachedSiteMetadataSlice('roles') ?? [];
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [selectedRoleCode, setSelectedRoleCode] = useState<'TALENT' | 'EMPLOYER'>('TALENT');

  const selectedRole = useMemo(() => rolesRaw.find((r) => r.code === selectedRoleCode), [rolesRaw, selectedRoleCode]);
  const selectedRoleId = selectedRole?.id ?? '';

  const handleGoogleLogin = () => {
    if (!selectedRoleId) return;
    googleLoginMutation.mutate({ role: selectedRoleId });
  };

  const switchTo = (next: 'login' | 'register') => setSearchParams({ mode: next });

  return (
    <NoNavigationLayout>
      <div className="flex flex-row items-center gap-36 w-full">
        {/* Banner */}
        <article className="hidden lg:flex flex-col relative pl-10 h-full justify-between">
          <div className="flex flex-col gap-12">
            <h2 className="font-extrabold text-4xl">
              ¡{t('auth.page.welcome')} <span>{t('company.site')}!</span>
            </h2>
            <h2 className="font-light text-lg">{t('auth.page.text_1')}</h2>
            <ul className="list-disc pl-5 font-light">
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
            <h2 className="font-bold text-lg mt-8">{t('auth.page.text_resaltador')}</h2>
          </div>
          <aside className="self-center mt-32 flex flex-col items-center gap-2">
            <img src={logo} alt="" className="w-14" />
            <p className="text-sm font-bold">{t('company.site')}</p>
          </aside>
        </article>

        {/* Forms */}
        <article className="w-full h-full m-auto flex flex-col justify-center sm:max-w-md xl:max-w-lg lg:bg-white lg:px-8 lg:rounded-xl lg:shadow-[0_0_8px_3px_rgba(0,0,0,0.06)] lg:min-h-[720px]">
          <div className="flex flex-col gap-4 items-center pb-6">
            <LinkLogo />
          </div>

          {/* Role Switcher */}
          {mode === 'register' && (
            <div className="w-full mb-6">
              <div className="flex rounded-lg border border-[var(--color-secondary-outline)] bg-[var(--color-primary-white)] p-1 text-sm font-semibold">
                <button
                  type="button"
                  className={`flex-1 rounded-lg py-3 px-4 text-center cursor-pointer transition-colors ${
                    selectedRoleCode === 'TALENT'
                      ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)]'
                      : 'bg-transparent text-[var(--color-primary-black)]'
                  }`}
                  onClick={() => setSelectedRoleCode('TALENT')}
                >
                  {t('auth.register.role_talent')}
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg py-3 px-4 text-center cursor-pointer transition-colors ${
                    selectedRoleCode === 'EMPLOYER'
                      ? 'bg-[var(--color-secondary-white)] text-[var(--color-primary-purple)]'
                      : 'bg-transparent text-[var(--color-primary-black)]'
                  }`}
                  onClick={() => setSelectedRoleCode('EMPLOYER')}
                >
                  {t('auth.register.role_employer')}
                </button>
              </div>
            </div>
          )}

          <GoogleButton className="cursor-pointer" onClick={handleGoogleLogin}>
            {t('auth.login.google')}
          </GoogleButton>

          <div className="w-full relative flex justify-between items-center py-4">
            <hr className="opacity-20 w-full" />
            <p className="text-sm mx-4 whitespace-nowrap">{t('auth.page.or_login_with')}</p>
            <hr className="opacity-20 w-full" />
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitch={() => switchTo('register')} />
          ) : (
            <RegisterForm onSwitch={() => switchTo('login')} role={selectedRoleId} />
          )}
        </article>
      </div>
    </NoNavigationLayout>
  );
}
