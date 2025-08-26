import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../services/authService';
import type { AuthenticationResponse, LoginRequest } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';

export const useLoginMutation = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AuthenticationResponse, any, LoginRequest>({
    mutationFn: login,
    onSuccess: (data: AuthenticationResponse) => {
      setAuthToken(data.token);
      qc.clear();
      navigate(ROUTES.DASHBOARD);
    },
  });
};
