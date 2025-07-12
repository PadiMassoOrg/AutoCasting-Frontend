import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../sevices/authService';
import type { ResetPasswordRequest } from '../types/auth.types';

export const useResetPasswordMutation = () => {
  return useMutation<void, any, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
};
