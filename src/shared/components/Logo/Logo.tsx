import React from 'react';
import AC_LOGO from '../../../shared/lib/autocasting-logo.svg';

const Logo = () => {
  return (
    <div className="flex flex-col gap-1">
      <img src={AC_LOGO}></img>
      <p>auto-casting.com</p>
    </div>
  );
};

export default Logo;
