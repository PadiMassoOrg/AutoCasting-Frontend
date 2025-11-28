import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { jwtDecoder } from '../../../shared/utils/jwtDecoder';
import { login } from '../services/authService';
import type { AuthenticationResponse, LoginRequest } from '../types/auth.types';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation<AuthenticationResponse, any, LoginRequest>({
    mutationFn: login,
    onSuccess: (data: AuthenticationResponse) => {
      setAuthToken(data.token);
      const payload = jwtDecoder(data.token);
      const slug = payload?.publicSlug;
      if (slug) {
        navigate(`${ROUTES.PUBLIC_PROFILE}/${slug}`, { replace: true });
      } else {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    },
  });
};
