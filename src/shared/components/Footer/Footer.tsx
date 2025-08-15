import { ROUTES } from '../../lib/routes';
import { LinkLogo } from '../LinkLogo';

const Footer = () => {
  return (
    <div className="w-full grid items-center">
      <LinkLogo horizontal className="py-12" path={ROUTES.HOME}></LinkLogo>
    </div>
  );
};

export default Footer;
