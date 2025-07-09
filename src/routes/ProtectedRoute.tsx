import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../shared/lib/cookies';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getAuthToken();

  return token ? <>{children}</> : <Navigate to="/" replace />;
}
