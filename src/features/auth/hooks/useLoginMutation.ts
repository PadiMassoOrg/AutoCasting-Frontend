import { useMutation } from '@tanstack/react-query';
import { login } from '../services/authService';
import type { AuthenticationResponse, LoginRequest } from '../types/auth.types';

export const useLoginMutation = () => {
  return useMutation<AuthenticationResponse, any, LoginRequest>({
    mutationFn: login,
  });
};
