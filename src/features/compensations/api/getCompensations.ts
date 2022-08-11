import { useQuery } from 'react-query';

import { SortState } from '@/hooks/useSort';
import { httpClient } from '@/lib/httpClient';
import { getFromFilter } from '@/utils/queryParams';

import { Compensation, compensationKeys } from '../types';

export type PaginatedCompensationResponse = {
  data: Compensation[];
  total: number;
};

function fetchCompensations(filter: Record<string, unknown>): Promise<PaginatedCompensationResponse> {
  const params = getFromFilter(filter);
  return httpClient.get(`/compensations/paginated?${params}`);
}

export function useGetCompensations(sort: SortState, firstIndex?: number, maxItemsPerPage?: number) {
  const filter = {
    _sort: !!sort.field && !!sort.order ? `${sort.field}:${sort.order}` : 'createdAt:desc',
    _start: firstIndex ?? '0',
    _limit: maxItemsPerPage ?? '10',
  };

  return useQuery(compensationKeys.paginated(filter), () => fetchCompensations(filter));
}
