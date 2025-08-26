import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register } from '../services/authService';
import type { AuthenticationResponse, RegisterRequest } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';
import { ROUTES } from '../../../shared/lib/routes';

export const useRegisterMutation = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AuthenticationResponse, any, RegisterRequest>({
    mutationFn: register,
    onSuccess: (data) => {
      setAuthToken(data.token);
      qc.clear();
      navigate(ROUTES.DASHBOARD);
    },
  });
};
