import { SessionWallet } from 'algorand-session-wallet';
import algosdk from 'algosdk';
import { Buffer } from 'buffer';
import jwtDecode from 'jwt-decode';
import { AuthProviderConfig, initReactQueryAuth } from 'react-query-auth';

import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import {
  AuthUser,
  ChallengeResponse,
  getUser,
  LoginCredentialsDTO,
  RegisterCredentialsDTO,
  UserResponse,
} from '@/features/auth';
import { httpClient } from '@/lib/httpClient';
import { setSW, sw } from '@/lib/sessionWallet';
import storage from '@/utils/storage';

function isJwtExpired(token: string) {
  let isJwtExpired = false;
  const { exp }: any = jwtDecode(token);
  const currentTime = new Date().getTime() / 1000;

  if (currentTime > exp) isJwtExpired = true;

  return isJwtExpired;
}

async function loadUser(): Promise<AuthUser | null> {
  const localJWT = storage.getToken();
  console.log('loading user ...', localJWT);
  if (process.env.NODE_ENV === 'test') return { name: 'Fernando' } as AuthUser;
  if (!localJWT || isJwtExpired(localJWT)) return null;

  const userMetadata = await getUser();

  if (!sw || sw.wname !== userMetadata.issuer)
    setSW(
      new SessionWallet(
        'TestNet',
        undefined,
        userMetadata.issuer,
        userMetadata.email,
        process.env.REACT_APP_MAGICLINK_PUBLIC as string,
        process.env.REACT_APP_ALGORAND_RPC_URL as string
      )
    );

  return userMetadata;
}

async function loginFn(data: LoginCredentialsDTO): Promise<AuthUser | null> {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const w = new SessionWallet(
    'TestNet',
    undefined,
    data.issuer,
    data.email,
    process.env.REACT_APP_MAGICLINK_PUBLIC as string,
    process.env.REACT_APP_ALGORAND_RPC_URL as string
  );

  setSW(w);
  if (!sw) return null;

  if (!(await sw.connect())) return null;

  const challenge: ChallengeResponse = await httpClient.get(
    `/web3-auth/challenge/${await sw.getDefaultAccount()}`
  );

  const { challengeTxn } = challenge;
  const rawTxnChallenge = Buffer.from(Object.values(challengeTxn));
  const unsignedTxn = algosdk.decodeUnsignedTransaction(rawTxnChallenge);
  const signedTxns = await sw.signTxn([unsignedTxn]);
  const signedTxn = signedTxns[0];

  const response: UserResponse = await httpClient.post(`/web3-auth/login`, {
    challengeTxn: signedTxn,
    issuer: data.issuer,
    email: data.email,
  });

  storage.setToken(response.jwt as string);

  return response.user;
}

async function registerFn(data: RegisterCredentialsDTO) {
  // const response = await registerWithEmailAndPassword(data);
  // const user = await handleUserResponse(response);
  //
  // // TODO: fix this
  // return user as unknown as AuthUser;
  return null;
}

async function logoutFn() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  sw?.disconnect();
  storage.clearToken();
  window.location.assign(window.location.origin as unknown as string);
}

const authConfig: AuthProviderConfig<AuthUser | null, unknown> = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent() {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  },
  waitInitial: process.env.NODE_ENV !== 'test',
};

export const { AuthProvider, useAuth } = initReactQueryAuth<
  AuthUser | null,
  unknown,
  LoginCredentialsDTO,
  RegisterCredentialsDTO
>(authConfig);
