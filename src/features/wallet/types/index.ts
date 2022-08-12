export interface IndexerAccount {
  account: Account;
  'current-round': number;
}

export interface Account {
  address: string;
  amount: number;
  'amount-without-pending-rewards': number;
  assets: Asset[];
  'created-at-round': number;
  deleted: boolean;
  'pending-rewards': number;
  'reward-base': number;
  rewards: number;
  round: number;
  'sig-type': string;
  status: string;
  'total-apps-opted-in': number;
  'total-assets-opted-in': number;
  'total-created-apps': number;
  'total-created-assets': number;
}

export interface Asset {
  amount: number;
  'asset-id': number;
  deleted: boolean;
  'is-frozen': boolean;
  'opted-in-at-round': number;
}

export type DialogDataProps = {
  acceptLabel: string;
  title: string;
  claim: string;
  accentColor: string;
  button: ButtonProps;
};

export type ButtonProps = {
  variant: 'grey' | 'danger';
  onClick: () => void;
  label: string;
};
