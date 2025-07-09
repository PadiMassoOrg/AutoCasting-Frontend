import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../../shared/lib/cookies';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAuthToken(token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return <div>Redirigiendo...</div>;
};

export default OAuthSuccess;
