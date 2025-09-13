import { Separator } from 'autocasting-ui-library-padimasso';
import { LinkLogo } from '../LinkLogo';

const Footer = () => {
  return (
    <div className="w-full grid items-center lg:hidden">
      <Separator className="opacity-20 mt-20" />
      <LinkLogo horizontal className="py-12" path={null}></LinkLogo>
    </div>
  );
};

export default Footer;
