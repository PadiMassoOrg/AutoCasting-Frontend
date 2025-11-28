import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { jwtDecoder } from '../../../shared/utils/jwtDecoder';
import { register } from '../services/authService';
import type { AuthenticationResponse, RegisterRequest } from '../types/auth.types';

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation<AuthenticationResponse, any, RegisterRequest>({
    mutationFn: register,
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
