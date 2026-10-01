import { Logo } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';
import { ROUTES } from '../../lib/routes';

type LinkLogoProps = {
  path?: string | null;
  horizontal?: boolean;
  className?: string;
};

const LinkLogo = ({ path = ROUTES.HOME, horizontal, className }: LinkLogoProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const logo = (
    <Logo text={t('company.site')} imageSrc={AC_LOGO} horizontal={horizontal} className={className} imageSize={50} />
  );

  // A click on an already-active route doesn't change the URL, so the
  // global ScrollToTop (which only reacts to URL changes) never fires -
  // scroll to top directly here to cover that same-route case too. Only
  // this same-route case gets a smooth scroll: a real navigation is instead
  // owned by ScrollToTop's own repeated force-to-top passes, which would
  // otherwise fight (and snap away) a smooth animation started here.
  const handleClick = () => {
    if (path && `${location.pathname}${location.search}` === path) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return path ? (
    <Link to={path} onClick={handleClick}>
      {logo}
    </Link>
  ) : (
    logo
  );
};

export default LinkLogo;
