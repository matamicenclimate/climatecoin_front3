import { httpClient } from '@/lib/httpClient';

import { AuthUser } from '../types';

export const getUser = async (): Promise<AuthUser> => {
  const strapiUser: AuthUser = await httpClient.get('/users/me');
  return strapiUser;
};
