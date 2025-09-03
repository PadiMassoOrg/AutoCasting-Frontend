import { Logo } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';
import { ROUTES } from '../../lib/routes';

type LinkLogoProps = {
  path?: string | null; // ahora puede ser string o null
  horizontal?: boolean;
  className?: string;
};

const LinkLogo = ({ path = ROUTES.HOME, horizontal, className }: LinkLogoProps) => {
  const { t } = useTranslation();

  const logo = (
    <Logo text={t('company.site')} imageSrc={AC_LOGO} horizontal={horizontal} className={className} imageSize={60} />
  );

  // si hay path, se envuelve en Link
  return path ? <Link to={path}>{logo}</Link> : logo;
};

export default LinkLogo;
