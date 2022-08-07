import { createContext, ReactElement, useContext } from 'react';
import { UseQueryResult } from 'react-query';

import { IndexerAccount, useGetBalance } from '@/features/wallet';
import { useAuth } from '@/lib/auth';

interface Context {
  account: UseQueryResult<IndexerAccount, unknown>;
}

const WalletContext = createContext<Context | null>(null);

interface ProviderProps {
  children: ReactElement;
}

export const WalletProvider = ({ children }: ProviderProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth = process.env.NODE_ENV !== 'test' ? useAuth() : () => ({});
  // @ts-expect-error need to mock this better
  const account = useGetBalance(auth?.user?.publicAddress ?? null);

  return <WalletContext.Provider value={{ account }}>{children}</WalletContext.Provider>;
};

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  const { account } = ctx;

  const usdcDecimalPlaces = 1000000; // 6 decimal places
  const usdcBalance = () =>
    getAssetBalance(Number(process.env.REACT_APP_USDC_ASA_ID)) / usdcDecimalPlaces;

  const climatecoinBalance = () =>
    getAssetBalance(Number(process.env.REACT_APP_CLIMATECOIN_ASA_ID));

  const algoDecimalPlaces = 1000000; // 6 decimal places
  const algoBalance = () =>
    account.data?.account.amount ? account.data?.account.amount / algoDecimalPlaces : 0;

  const getAssetBalance = (assetId: number) => {
    if (!account.data) return 0;
    if (!account.data.account.assets) return 0;

    const assetData = account.data.account.assets.filter((asset) => asset['asset-id'] === assetId);

    if (assetData.length !== 1) return 0;

    return assetData[0].amount;
  };

  const hasOptedIn = (assetId: number) => {
    if (!account.data) return false;
    if (!account.data.account.assets) return false;

    const assetData = account.data.account.assets.filter((asset) => asset['asset-id'] === assetId);

    return assetData.length === 1;
  };

  return {
    account: account.data?.account,
    usdcBalance,
    climatecoinBalance,
    algoBalance,
    hasOptedIn,
  };
};
