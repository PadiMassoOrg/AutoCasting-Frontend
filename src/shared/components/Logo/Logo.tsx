import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';

const Logo = () => {
  return (
    <div className="flex flex-col">
      <img src={AC_LOGO}></img>
      <p className="text-sm font-bold">auto-casting.com</p>
    </div>
  );
};

export default Logo;
