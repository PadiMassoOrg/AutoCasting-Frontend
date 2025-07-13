import { useTranslation } from 'react-i18next';
import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';

const Logo = ({ horizontal }: { horizontal?: boolean }) => {
  const { t } = useTranslation();

  return (
    <div className={`flex ${horizontal ? 'flex-row' : 'flex-col'} gap-[6px] items-center justify-center`}>
      <img src={AC_LOGO} className={`${horizontal ? 'w-[2.5rem]' : 'w-[5rem]'}`}></img>
      <p className={`${horizontal ? 'text-sm' : 'text-base'} font-bold`}>{t('company.site')}</p>
    </div>
  );
};

export default Logo;
