import { format } from 'date-fns';
import { useQuery } from 'react-query';

import { SortState } from '@/hooks/useSort';
import { httpClient } from '@/lib/httpClient';
import { getFromFilter } from '@/utils/queryParams';

import { CarbonDocument, documentKeys } from '../types';

function fetchDocuments(filter: Record<string, unknown>): Promise<CarbonDocument[]> {
  const params = getFromFilter(filter);
  return httpClient.get(`/carbon-documents?${params}`);
}

export function useGetDocuments(filter: Record<any, any>, sort: SortState) {
  const { dates, ...newFilter } = filter;
  const parsed = {
    ...newFilter,
    credit_start_lte: dates?.from ? format(dates.from, 'yyyy-MM-dd') : undefined,
    credit_end_gte: dates?.to ? format(dates.to, 'yyyy-MM-dd') : undefined,
    _sort: !!sort.field && !!sort.order ? `${sort.field}:${sort.order}` : undefined,
  };
  return useQuery(documentKeys.search(parsed), () => fetchDocuments(parsed));
}
