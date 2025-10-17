import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../services/authService';
import type { ResetPasswordRequest } from '../types/auth.types';

export const useResetPasswordMutation = () => {
  return useMutation<void, any, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
};
