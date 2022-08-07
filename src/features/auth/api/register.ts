import { WalletIssuer } from '@/features/auth';
import { httpClient } from '@/lib/httpClient';

export type RegisterCredentialsDTO = {
  email?: string;
  issuer: WalletIssuer;
};

export const registerWithEmailAndPassword = (data: RegisterCredentialsDTO): Promise<any> => {
  return httpClient.post('/auth/register', data);
};
