import { useMutation } from '@tanstack/react-query';
import { login } from '../sevices/authService';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, any, LoginRequest>({
    mutationFn: login,
  });
};
