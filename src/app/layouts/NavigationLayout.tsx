import { Outlet } from 'react-router-dom';
import DocumentScrollLayout from './DocumentScrollLayout';

export default function NavigationLayout() {
  return (
    <DocumentScrollLayout contentClassName="w-full min-w-0 bg-(--color-secondary-white)">
      <div className="w-full max-w-[1650px] mx-auto p-6 lg:px-[40px] lg:py-[24px]">
        <Outlet />
      </div>
    </DocumentScrollLayout>
  );
}
