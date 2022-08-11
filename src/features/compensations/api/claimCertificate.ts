import algosdk from 'algosdk';
import { Buffer } from 'buffer';
import { useAlert } from 'react-alert';
import { useMutation } from 'react-query';

import { httpClient } from '@/lib/httpClient';
import { queryClient } from '@/lib/react-query';
import { sw } from '@/lib/sessionWallet';

import { CertificateClaimTxns, Compensation, compensationKeys } from '../types';

async function handleClaimCertificate({
  compensationId,
  encodedOptinTxn,
  encodedSendTxn,
}: CertificateClaimTxns): Promise<Compensation> {
  // convert the txns to buffers
  const optinTxnBuffer = Buffer.from(Object.values(encodedOptinTxn));
  const sendTxnBuffer = Buffer.from(Object.values(encodedSendTxn));

  // skip this in testing
  if (process.env.NODE_ENV === 'test') {
    return httpClient.post(`/compensations/${compensationId}/claim/certificate`, {
      signedTxn: [],
    });
  }

  const optinTxn = algosdk.decodeUnsignedTransaction(optinTxnBuffer);
  const sendTxn = algosdk.decodeUnsignedTransaction(sendTxnBuffer);

  // decode and sign
  const signedTxnObj = await sw?.signTxn([optinTxn, sendTxn]);
  if (!signedTxnObj) return Promise.reject('Transaction not signed');
  const signedTxn = signedTxnObj.map((stxn) => stxn.blob);

  return httpClient.post(`/compensations/${compensationId}/claim/certificate`, {
    signedTxn,
  });
}

export function useClaimCertificate() {
  const alert = useAlert();
  return useMutation((claimTxns: CertificateClaimTxns) => handleClaimCertificate(claimTxns), {
    onSuccess: () => {
      queryClient.invalidateQueries(compensationKeys.all);
      alert.success('Certificate NFT claimed successfully');
    },
    onError: () => {
      alert.error('Error claiming the certificate');
    },
  });
}
