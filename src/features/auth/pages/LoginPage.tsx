import { Layout } from '../../../shared/components/Layouts';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <Layout>
      <div className="bg-white rounded-[20px] shadow p-4">
        <LoginForm />
      </div>
    </Layout>
  );
}
