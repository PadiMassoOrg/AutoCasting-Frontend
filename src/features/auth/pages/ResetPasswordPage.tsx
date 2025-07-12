import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '../components';
import { useEffect } from 'react';
import { Layout } from '../../../shared/components/Layouts';

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
      <Layout>
        <article className="">
          <h2>ResetPassword Page</h2>
        </article>
        <ResetPasswordForm token={token}></ResetPasswordForm>
      </Layout>
    );
};

export default ResetPasswordPage;
