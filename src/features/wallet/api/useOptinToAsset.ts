import algosdk, { waitForConfirmation } from 'algosdk';
import { useAlert } from 'react-alert';
import { useMutation, useQueryClient } from 'react-query';

import { getClient } from '@/lib/algosdk';
import { sw } from '@/lib/sessionWallet';
import { useWalletContext } from '@/providers/Wallet.context';

export function useOptinToAsset() {
  const queryClient = useQueryClient();
  const alert = useAlert();

  const { account, hasOptedIn } = useWalletContext();

  const optinToAsset = async (asaId: number) => {
    // create the asset accept transaction
    console.log('opting in...');

    if (hasOptedIn(asaId)) return Promise.resolve();
    if (!account?.address) return;
    console.log('opting in...');
    const suggestedParams = await getClient().getTransactionParams().do();

    const transactionOptions = {
      from: account?.address,
      to: account?.address,
      assetIndex: asaId,
      amount: 0, // this is an optinTxn so amount has to be 0
      suggestedParams,
    };

    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(transactionOptions);
    console.log({ txn });

    const signedTxns = await sw?.signTxn([txn]);
    if (!signedTxns) return alert.error('Transaction not signed!');
    const signedTxn = signedTxns[0];

    const { txId } = await getClient().sendRawTransaction(signedTxn.blob).do();
    const result = await waitForConfirmation(getClient(), txId, 3);

    console.log({ result });
  };

  return useMutation((assetId: number) => optinToAsset(assetId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['account']);
    },
    onError: () => {
      alert.error('Error uploading document');
    },
  });
}
