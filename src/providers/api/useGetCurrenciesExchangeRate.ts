import { useQuery } from 'react-query';

import { httpClient } from '@/lib/httpClient';

export interface CurrencyInfo {
  _id: string;
  usd_eur: number;
  usd_jpy: number;
  usd_gbp: number;
  usd_btc: number;
  createdAt: Date;
  updatedAt: Date;
  usd_usd: number;
  usd_climatecoin: number;
}

function fetchCurenciesExchangeRate(): Promise<CurrencyInfo> {
  return httpClient.get(`/currency`);
}

export function useGetCurrenciesExchangeRate() {
  return useQuery(['currencies'], fetchCurenciesExchangeRate, {
    staleTime: 60 * 60,
    refetchOnWindowFocus: false,
  });
}
