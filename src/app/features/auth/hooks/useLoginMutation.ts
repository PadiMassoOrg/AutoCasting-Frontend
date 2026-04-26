import { useMutation } from '@tanstack/react-query';
import i18n from 'i18next';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';
import { loginAndAcceptLegal } from '../services/authService';
import type { AuthenticationResponse, LoginRequest } from '../types/auth.types';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation<AuthenticationResponse, any, LoginRequest>({
    mutationFn: (payload) => loginAndAcceptLegal(payload, i18n.language),
    onSuccess: (data: AuthenticationResponse) => {
      setAuthToken(data.token);
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
  });
};
