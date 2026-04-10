import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthToken } from '../features/auth/hooks/useAuthToken';
import { ROUTES } from '../shared/lib/routes';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthToken();

  return token ? <>{children}</> : <Navigate to={ROUTES.HOME} replace />;
}
