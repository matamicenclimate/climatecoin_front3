import { useAlert } from 'react-alert';
import { useMutation } from 'react-query';

import { AuthUser } from '@/features/auth';
import { useAuth } from '@/lib/auth';
import { httpClient } from '@/lib/httpClient';

function putUserType(userId: string, type: string): Promise<AuthUser> {
  return httpClient.put(`/users/${userId}`, { type });
}

export function useUpdateUserType() {
  const alert = useAlert();
  const auth = useAuth();

  return useMutation(
    ({ userId, type }: { userId: string; type: string }) => putUserType(userId, type),
    {
      onSuccess: () => {
        auth.refetchUser();
      },
      onError: () => {
        alert.error('Error updating the user');
      },
    }
  );
}
