import * as Sentry from '@sentry/react';
import * as React from 'react';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { Alert } from '@/componentes/Elements/Alert/Alert';
import { AuthProvider } from '@/lib/auth';
import { queryClient } from '@/lib/react-query';

import { CurrencyProvider } from './Currency.context';
import { WalletProvider } from './Wallet.context';

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const ErrorFallback = () => {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  );
};

export const AppProvider = ({ children }: { children: React.ReactElement }) => {
  return (
    <>
      <Sentry.ErrorBoundary fallback={() => <ErrorFallback />} showDialog>
        <HelmetProvider>
          <AlertProvider template={Alert} {...options}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
                <CurrencyProvider>
                  <WalletProvider>{children}</WalletProvider>
                </CurrencyProvider>
              </AuthProvider>
            </QueryClientProvider>
          </AlertProvider>
        </HelmetProvider>
      </Sentry.ErrorBoundary>
    </>
  );
};
