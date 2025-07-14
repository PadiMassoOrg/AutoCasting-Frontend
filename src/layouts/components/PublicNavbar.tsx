import React from 'react';
import { Logo } from '../../shared/components/Logo';

const PublicNavbar = () => {
  return (
    <div className="flex items-center justify-start bg-white p-4 w-full">
      <Logo horizontal />
    </div>
  );
};

export default PublicNavbar;
