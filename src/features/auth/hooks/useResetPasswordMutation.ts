import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/lib/routes';
import { resetPassword } from '../services/authService';
import type { ResetPasswordRequest } from '../types/auth.types';

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation<void, any, ResetPasswordRequest>({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate(ROUTES.DASHBOARD);
    },
  });
};
