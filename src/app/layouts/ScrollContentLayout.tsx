import { Outlet } from 'react-router-dom';
import DocumentScrollLayout from './DocumentScrollLayout';

type ScrollContentLayoutProps = {
  variant?: 'default' | 'desktop-full-bleed';
};

export default function ScrollContentLayout({ variant = 'default' }: ScrollContentLayoutProps) {
  const isDesktopFullBleed = variant === 'desktop-full-bleed';
  const contentClassName = isDesktopFullBleed
    ? 'w-full min-w-0 bg-(--color-secondary-white) p-6 lg:p-0'
    : 'w-full min-w-0 bg-(--color-secondary-white) p-6 lg:p-[56px]';

  return (
    <DocumentScrollLayout contentClassName={contentClassName}>
      <Outlet />
    </DocumentScrollLayout>
  );
}
