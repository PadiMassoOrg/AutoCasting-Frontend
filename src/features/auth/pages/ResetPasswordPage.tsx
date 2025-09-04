import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '../components';
import { useEffect } from 'react';
import AuthenticationLayout from '../../../layouts/AuthenticationLayout';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth?error=invalid_token');
    }
  }, [token]);

  if (token)
    return (
      <AuthenticationLayout>
        <article className="">
          <h2>ResetPassword Page</h2>
        </article>
        <ResetPasswordForm token={token}></ResetPasswordForm>
      </AuthenticationLayout>
    );
};

export default ResetPasswordPage;
