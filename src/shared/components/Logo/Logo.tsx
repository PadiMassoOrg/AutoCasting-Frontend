import { useTranslation } from 'react-i18next';
import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';

const Logo = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-[6px] items-center justify-center">
      <img src={AC_LOGO} className="w-[5rem]"></img>
      <p className="text-base font-bold">{t('company.site')}</p>
    </div>
  );
};

export default Logo;
