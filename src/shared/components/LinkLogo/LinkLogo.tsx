import { useTranslation } from 'react-i18next';
import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';
import { Link } from 'react-router-dom';
import { Logo } from 'autocasting-ui-library-padimasso';
import { ROUTES } from '../../lib/routes';

type LinkLogoProps = {
  path?: string;
  horizontal?: boolean;
  className?: string;
};

const LinkLogo = ({ path = ROUTES.HOME, horizontal, className }: LinkLogoProps) => {
  const { t } = useTranslation();
  return (
    <Link to={path}>
      <Logo text={t('company.site')} imageSrc={AC_LOGO} horizontal={horizontal} className={className} imageSize={60} />
    </Link>
  );
};

export default LinkLogo;
