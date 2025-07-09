import api from '../../../shared/lib/axios';

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const googleLogin = async (data: { state: string }) => {
  let finalUrl = `${import.meta.env.VITE_BASE_API_URL}/oauth2/authorization/google`;
  data.state ? (finalUrl += `?state=${data.state}`) : '';
  window.location.href = finalUrl;
};
