import algosdk from 'algosdk';
import { Buffer } from 'buffer';
import { useAlert } from 'react-alert';
import { useMutation } from 'react-query';

import { httpClient } from '@/lib/httpClient';
import { queryClient } from '@/lib/react-query';
import { sw } from '@/lib/sessionWallet';

import { SignedTxn } from '../../../../../algorand-session-wallet';
import { Compensation, CompensationCalculation, compensationKeys } from '../types';

async function handleBurnClimatecoins({
  amount,
  encodedTransferTxn,
  encodedFundsTxn,
  encodedParamsTxn,
  encodedBurnTxn,
  signature,
  nftIds,
}: CompensationCalculation): Promise<Compensation> {
  // skip this in testing
  if (process.env.NODE_ENV === 'test') {
    return httpClient.post(`/compensations`, {
      signedTxn: [],
      amount,
      nfts: nftIds,
    });
  }

  // convert the txns to Transaction objects
  const transferTxn = algosdk.decodeUnsignedTransaction(
    Buffer.from(Object.values(encodedTransferTxn))
  );
  const fundsTxn = algosdk.decodeUnsignedTransaction(Buffer.from(Object.values(encodedFundsTxn)));
  const oracleTxn = algosdk.decodeUnsignedTransaction(Buffer.from(Object.values(encodedParamsTxn)));
  const burnTxn = algosdk.decodeUnsignedTransaction(Buffer.from(Object.values(encodedBurnTxn)));

  const signedTxns: SignedTxn[] | undefined = await sw?.signTxn([
    transferTxn,
    fundsTxn,
    oracleTxn,
    burnTxn,
  ]);
  if (!signedTxns) return Promise.reject('Transaction not signed');

  const signedTxnBlobs = signedTxns.map((stxn) => stxn.blob);

  return httpClient.post(`/compensations`, {
    signedTxn: signedTxnBlobs,
    signature,
    amount,
    nfts: nftIds,
  });
}

export function useBurnClimatecoins() {
  const alert = useAlert();
  return useMutation((burnParams: CompensationCalculation) => handleBurnClimatecoins(burnParams), {
    onSuccess: () => {
      queryClient.invalidateQueries(['account']);
      queryClient.invalidateQueries(compensationKeys.lists());
      alert.success('Climatecoins compensated succesfully');
    },
    onError: () => {
      alert.error('Error burning compensations');
    },
  });
}
