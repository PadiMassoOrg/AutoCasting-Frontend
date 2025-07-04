import { LanguageSwitcher } from '../LanguageSwitcher';

const Footer = () => {
  return (
    <div className="w-full h-16 bg-slate-200 flex flex-col items-center">
      <div className="w-[80%] m-auto">
        <LanguageSwitcher></LanguageSwitcher>
      </div>
    </div>
  );
};

export default Footer;
