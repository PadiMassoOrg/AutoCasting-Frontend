import { LoginForm } from '../features/auth/components';
import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <LanguageSwitcher />
        <LoginForm />
      </div>
    </div>
  );
}
