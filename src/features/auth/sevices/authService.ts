import api from '../../../shared/lib/axios';

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  console.log(response);
  return response.data;
};
