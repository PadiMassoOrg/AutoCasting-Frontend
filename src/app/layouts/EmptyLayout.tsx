import { EmptyLayoutShell } from 'autocasting-ui-library-padimasso';
import { Outlet } from 'react-router-dom';

export default function EmptyLayout() {
  return (
    <EmptyLayoutShell>
      <Outlet />
    </EmptyLayoutShell>
  );
}
