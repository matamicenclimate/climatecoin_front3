import { Nft } from '@/features/nfts';

export const compensationKeys = {
  all: ['compensations'] as const,
  lists: () => [...compensationKeys.all, 'list'] as const,
  me: () => [...compensationKeys.all, 'list', 'me'] as const,
  detail: (id: string) => [...compensationKeys.all, 'detail', id] as const,
  paginated: (filter: Record<string, unknown>) => [...compensationKeys.all, 'list', 'paginated', JSON.stringify(filter)] as const,
};

export interface CompensationCalculation {
  amount: number;
  assets: number[]; // blockchain asa ids
  nftIds: string[]; // db ids
  encodedTransferTxn: { [key: string]: number };
  encodedFundsTxn: { [key: string]: number };
  encodedParamsTxn: { [key: string]: number };
  encodedBurnTxn: { [key: string]: number };
  signature: { [key: string]: number };
}
export interface Compensation {
  consolidation_certificate_ipfs_cid?: string;
  state: string;
  nfts: Nft[];
  burn_receipt: Record<string, any>;
  compensation_receipt_nft?: Nft;
  compensation_nft?: Nft;
  _id: string;
  txn_id: string;
  amount: string;
  published_at: Date;
  createdAt: Date;
  updatedAt: Date;
  receipt_claimed: boolean;
  __v: number;
  id: string;
}

export interface CertificateClaimTxns {
  compensationId: string;
  encodedOptinTxn: { [key: string]: number };
  encodedSendTxn: { [key: string]: number };
}
