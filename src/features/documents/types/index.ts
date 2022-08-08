import { Nft } from '@/features/nfts';

export const documentKeys = {
  all: ['document'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  search: (filter: Record<string, unknown>) =>
    [...documentKeys.all, 'list', JSON.stringify(filter)] as const,
  detail: (id: string) => [...documentKeys.all, 'detail', id] as const,
  form: () => [...documentKeys.all, 'form'] as const,
};

export interface CarbonDocument {
  status: string;
  pdd: Cover[];
  sdgs: Country[];
  _id: string;
  project_longitude: string;
  project_url: string;
  registry_url: string;
  project_latitude: string;
  serial_number: string;
  credit_end: Date;
  project_video: string;
  __v: number;
  title: string;
  credits: string;
  user: object;
  credit_start: Date;
  description: string;
  project_registration: Date;
  createdAt: Date;
  updatedAt: Date;
  country: Country;
  cover: Cover;
  project_type: Country;
  registry: Country;
  standard: Country;
  sub_type: Country;
  thumbnail: Cover;
  type: Country;
  verification_report: Cover;
  developer_nft: Nft;
  fee_nft: Nft;
  id: string;
}

export interface Country {
  _id: string;
  code?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
  instructions?: string;
  description?: string;
}

export interface Cover {
  _id: string;
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  url: string;
  formats?: Formats;
  provider: string;
  related: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
}

export interface Formats {
  thumbnail: Thumbnail;
}

export interface Thumbnail {
  name: string;
  hash: string;
  ext: string;
  mime: boolean;
  width: number;
  height: number;
  size: number;
  path: null;
  url: string;
}
