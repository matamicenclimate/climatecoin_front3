import { Button } from '@/componentes/Elements/Button/Button';
import { Form } from '@/componentes/Form/Form';
import { Input } from '@/componentes/Form/Inputs';
import { LoginLayout } from '@/componentes/Layout/LoginLayout';
import { useAuth } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { Link } from '@/componentes/Elements/Link/Link';
import { Title } from '@/componentes/Elements/Title/Title';
import { useState } from 'react';

export const Login = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: { email: string }) => {
    setLoading(true);
    await auth.login({ email: data.email });
    setLoading(false);
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
        <Title size={1}>{t('auth.Login.pageTitle')}</Title>
        <Form onSubmit={handleLogin} className="flex flex-col">
          <Input
            name="email"
            type="email"
            label={t('auth.Login.form.email')}
            placeholder={t('auth.Login.form.email')}
          />

          <Button type="submit" disabled={loading}>
            {t('auth.Login.login')}
          </Button>
        </Form>
      </div>
    </LoginLayout>
  );
};
