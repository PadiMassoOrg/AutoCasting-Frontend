import { useMutation } from '@tanstack/react-query';
import { register } from '../sevices/authService';

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  token: string;
};

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, any, RegisterRequest>({
    mutationFn: register,
  });
};
