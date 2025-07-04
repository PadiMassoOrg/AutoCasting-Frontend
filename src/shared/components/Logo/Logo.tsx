import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';

const Logo = () => {
  return (
    <div className="flex flex-col gap-[6px] items-center justify-center">
      <img src={AC_LOGO} className="w-[5rem]"></img>
      <p className="text-base font-bold">auto-casting.com</p>
    </div>
  );
};

export default Logo;
