import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DataRenderer } from '@/componentes/DataRenderer/DataRenderer';
import { Link } from '@/componentes/Elements/Link/Link';
import { Pill, PillProps } from '@/componentes/Elements/Pill/Pill';
import { Title } from '@/componentes/Elements/Title/Title';
import { Aside } from '@/componentes/Layout/Aside/Aside';
import { OperationsMenu } from '@/componentes/Layout/Aside/components/OperationsMenu';
import { PersonalMenu } from '@/componentes/Layout/Aside/components/PersonalMenu';
import { Pagination } from '@/componentes/Pagination/Pagination';
import { EXPLORER_URL, IPFS_GATEWAY_URL } from '@/config';
import { useSort } from '@/hooks/useSort';
import { useAuth } from '@/lib/auth';
import { useCurrencyContext } from '@/providers/Currency.context';
import { usePaginationContext } from '@/providers/Pagination.context';

import { PaginatedCompensationResponse, useGetCompensations } from '../api/getCompensations';

export const CompensationHistory = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { formatter, climatecoinValue } = useCurrencyContext();
  const { sort, toggleSort, renderArrow } = useSort();
  const { firstIndex, maxItemsPerPage, setTotalItems } = usePaginationContext();

  const getProfileAvatar = () => {
    if (user?.avatar?.url) {
      return user?.avatar.url;
    }
    return 'avatar-placeholder.jpg';
  };

  const methods = useForm<any>({
    mode: 'onBlur',
  });

  const paginatedCompensationResponse = useGetCompensations(sort, firstIndex, maxItemsPerPage);
  if (paginatedCompensationResponse?.data?.total) setTotalItems(paginatedCompensationResponse.data.total);
  const itemsToDisplay = paginatedCompensationResponse?.data?.data?.length || 0;
  const thStyles = 'flex cursor-pointer text-sm items-center pb-3';
  const linkStyles = 'inline-flex items-center';

  const pillVariants: Record<string, PillProps['variant']> = {
    pending: 'new',
    rejected: 'danger',
    accepted: 'featured',
    swapped: 'comingSoon',
    completed: 'popular',
  };

  const getPillLabel = (state: string) => {
    if (state === 'minted') {
      return t('compensate.History.status.accepted');
    }
    if (state === 'claimed') {
      return t('compensate.History.status.completed');
    }
    if (state === 'rejected') {
      return t('compensate.History.status.rejected');
    }
    return t('compensate.History.status.pending');
  };

  const renderTable = (model:PaginatedCompensationResponse) => (
    <tbody>
      {model.data.map((comp) => (
          <tr key={comp.id}>
            <td>
              <div className="flex py-3">
                <Pill variant={pillVariants[getPillLabel(comp.state).toLowerCase()]}>
                  {getPillLabel(comp.state)}
                </Pill>
              </div>
            </td>
            <td>
              <div>
                <span>{comp.amount && `${comp.amount} CC`}</span>
                <span className="ml-2 text-xs text-neutral-4">
                  {formatter(climatecoinValue(Number(comp.amount)))}
                </span>
              </div>
            </td>
            <td>
              <Link
                href={`${EXPLORER_URL}tx/group/${encodeURIComponent(comp.txn_id)}`}
                className={linkStyles}
                textVariant="text-neutral-4"
              >
                {`${comp.txn_id?.slice(0, 15)} ...${comp.txn_id?.slice(-5)}`}
              </Link>
            </td>
            <td>
              <div className="flex">
                <Link to={`/coins/compensate/${comp.id}`} textVariant="text-neutral-4">
                  {t('compensate.History.table.details')}
                </Link>
                <div className="ml-3">
                  <Link
                    textVariant="text-neutral-4"
                    href={`${IPFS_GATEWAY_URL}${comp.consolidation_certificate_ipfs_cid}`}
                    className={linkStyles}
                  >
                    {comp.consolidation_certificate_ipfs_cid &&
                      t('compensate.History.table.certificateView')}
                  </Link>
                </div>
              </div>
            </td>
          </tr>
      ))}
    </tbody>
  );

  return (
    <div className="mt-16 grid gap-8 md:grid-cols-4">
      <aside className="text-sm text-neutral-4">
        <img src={getProfileAvatar()} className="h-32 rounded-full" />
        <div className="mb-4 mt-8 flex flex-col capitalize ">
          <div className="text-2xl  text-black">
            {t('documents.Upload.hi')}
            {user?.username?.split('@')[0]} 👋🏻
          </div>
          <div className="mt-2 text-lg text-neutral-5">
            {user?.type}
            {user?.country?.name && `, ${user.country.name}`}
          </div>
        </div>
        <hr />
        <Aside menu={OperationsMenu()} />
        <hr />
        <Aside menu={PersonalMenu()} />
      </aside>
      <main className="space-y-4 md:col-span-3">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="items-left flex flex-col space-x-2 space-y-6">
            <Title size={3} as={5} className="mb-3">
              {t('compensate.History.title')}
            </Title>
            <table className="font-Poppins w-full text-sm font-medium text-primary">
              <thead className="border-b-2 border-neutral-6 text-left text-xs text-neutral-4">
                <tr>
                  <th>
                    <div className={clsx(thStyles)} onClick={() => toggleSort('state')}>
                      {t('compensate.History.table.status')}
                      {renderArrow('state')}
                    </div>
                  </th>
                  <th>
                    <div className={clsx(thStyles)} onClick={() => toggleSort('amount')}>
                      {t('compensate.History.table.amount')} {renderArrow('amount')}
                    </div>
                  </th>
                  <th>
                    <div className={clsx(thStyles)} onClick={() => toggleSort('txn_id')}>
                      {t('compensate.History.table.operationID')} {renderArrow('txn_id')}
                    </div>
                  </th>
                  <th>
                    <div className={clsx(thStyles)}>{t('compensate.History.table.actions')}</div>
                  </th>
                </tr>
              </thead>

              <DataRenderer<PaginatedCompensationResponse>
                data={paginatedCompensationResponse}
                render={renderTable}
              />
            </table>
            {itemsToDisplay > 0 && (<Pagination/>)}
          </div>
        </form>
      </main>
    </div>
  );
};
