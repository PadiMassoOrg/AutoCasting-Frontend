import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../services/authService';
import type { ForgotPasswordRequest } from '../types/auth.types';

export const useForgotPasswordMutation = () => {
  return useMutation<void, any, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
};
