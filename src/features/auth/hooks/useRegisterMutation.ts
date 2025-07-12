import { useMutation } from '@tanstack/react-query';
import { register } from '../sevices/authService';
import type { AuthenticationResponse, RegisterRequest } from '../types/auth.types';

export const useRegisterMutation = () => {
  return useMutation<AuthenticationResponse, any, RegisterRequest>({
    mutationFn: register,
  });
};
