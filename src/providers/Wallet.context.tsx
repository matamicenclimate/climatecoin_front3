import { getBalance } from '@/features/wallet/api/getBalance';
import { magiclink } from '@/lib/magiclink';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UseQueryResult } from 'react-query';

interface Context {
  account: UseQueryResult<any, any>;
}

const WalletContext = createContext<Context | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export const WalletProvider = ({ children }: ProviderProps) => {
  const [wallet, setWallet] = useState<string | null>(null);

  const account = getBalance(wallet);

  useEffect(() => {
    const onMount = async () => {
      const publicAddress = await magiclink.algorand.getWallet();
      setWallet(publicAddress);
    };
    onMount();
  }, []);

  return <WalletContext.Provider value={{ account }}>{children}</WalletContext.Provider>;
};

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }

  const { account } = ctx;

  return { account };
};