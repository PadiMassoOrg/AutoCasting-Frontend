import { Separator } from 'autocasting-ui-library-padimasso';
import { LinkLogo } from '../LinkLogo';

const Footer = () => {
  return (
    <div className="w-full grid items-center md:hidden">
      <Separator className="opacity-20 mt-20" />
      <LinkLogo horizontal className="py-12" path="#"></LinkLogo>
    </div>
  );
};

export default Footer;
