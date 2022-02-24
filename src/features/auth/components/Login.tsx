import { Button } from '@/componentes/Elements/Button/Button';
import { Form } from '@/componentes/Form/Form';
import { Input } from '@/componentes/Form/Inputs';
import { LoginLayout } from '@/componentes/Layout/LoginLayout';
import { useAuth } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { Link } from '@/componentes/Elements/Link/Link';

export const Login = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (data: Record<string, any>) => {
    await auth.login({ email: data.email });
  };

  return (
    <LoginLayout title={t('auth.Login.pageTitle')}>
      <div>
        <Link to="/auth/login" as="button">
          login
        </Link>
        <Link to="/auth/register" as="button">
          register
        </Link>
        <Form onSubmit={handleLogin} className="flex flex-col">
          <label htmlFor="email">{t('auth.Login.form.email')}</label>
          <Input name="email" type="email" />

          <Button type="submit">{t('auth.Login.login')}</Button>
        </Form>
        <Link to="/">home</Link>
      </div>
    </LoginLayout>
  );
};
