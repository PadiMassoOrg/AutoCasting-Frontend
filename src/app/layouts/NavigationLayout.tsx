import { Outlet } from 'react-router-dom';
import DocumentScrollLayout from './DocumentScrollLayout';

type NavigationLayoutProps = {
  variant?: 'default' | 'public-profile-own';
};

export default function NavigationLayout({ variant = 'default' }: NavigationLayoutProps) {
  const containerClassName =
    variant === 'public-profile-own'
      ? 'w-full max-w-[1650px] mx-auto p-6 lg:px-[40px] lg:py-[24px]'
      : 'w-full max-w-[1650px] mx-auto p-6 lg:p-[56px]';

  return (
    <DocumentScrollLayout contentClassName="w-full min-w-0 bg-(--color-secondary-white)">
      <div className={containerClassName}>
        <Outlet />
      </div>
    </DocumentScrollLayout>
  );
}
