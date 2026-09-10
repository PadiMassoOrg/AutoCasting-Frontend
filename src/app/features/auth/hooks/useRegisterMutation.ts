import { useMutation } from '@tanstack/react-query';
import i18n from 'i18next';
import { useNavigate } from 'react-router-dom';
import { setAuthTokens } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { registerAndAcceptLegal } from '../services/authService';
import type { AuthenticationResponse, RegisterRequest } from '../types/auth.types';

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation<AuthenticationResponse, any, RegisterRequest>({
    mutationFn: (payload) => registerAndAcceptLegal(payload, i18n.language),
    onSuccess: (data: AuthenticationResponse) => {
      setAuthTokens(data.token, data.refreshToken);
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
  });
};
