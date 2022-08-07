import { LoginCredentialsDTO } from '@/features/auth';
import { magiclink } from '@/lib/magiclink';

export const loginWithEmailAndPassword = async (data: LoginCredentialsDTO): Promise<any> => {
  const redirectURI = `${window.location.origin}/auth/callback`; // 👈 This will be our callback URI

  return data.email
    ? magiclink.auth.loginWithMagicLink({ email: data.email, redirectURI })
    : undefined;

  // return httpClient.post('/auth/login', data);
};
