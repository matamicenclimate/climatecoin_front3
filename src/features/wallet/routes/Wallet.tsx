import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Card } from '@/componentes/Card/Card';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { Title } from '@/componentes/Elements/Title/Title';
import { Aside } from '@/componentes/Layout/Aside/Aside';
import { OperationsMenu } from '@/componentes/Layout/Aside/components/OperationsMenu';
import { PersonalMenu } from '@/componentes/Layout/Aside/components/PersonalMenu';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { useSort } from '@/hooks/useSort';
import { useAuth } from '@/lib/auth';
import { useCurrencyContext } from '@/providers/Currency.context';
import { useWalletContext } from '@/providers/Wallet.context';

import { AssetAction } from '../components/AssetAction';
import { SendFunds } from '../components/SendFunds';

export const Wallet = () => {
  const { t } = useTranslation();
  const { account, climatecoinBalance } = useWalletContext();
  const { user } = useAuth();

  const { sort, toggleSort, renderArrow } = useSort();
  const { formatter, climatecoinValue, formatToCC } = useCurrencyContext();

  const getProfileAvatar = () => {
    if (user?.avatar?.url) {
      return user?.avatar.url;
    }
    return 'avatar-placeholder.jpg';
  };

  const renderNfts = () => {
    if (account?.assets) {
      return (
        <>
          {account.assets.map((asset) => (
            <tbody key={asset['asset-id']}>
              <td className="flex">
                <div className="flex">
                  <span>{asset['asset-id']}</span>
                </div>
              </td>
              <td>
                <div className="flex flex-col">
                  <span> {t('intlNumber', { val: asset.amount.toFixed(2) })} CC</span>
                  <span className="text-xs text-neutral-4">
                    {formatter(climatecoinValue(Number(asset.amount)))}
                  </span>
                </div>
              </td>
              <td>
                <div>
                  {asset['is-frozen'] ? (
                    <span className="text-primary-red">Yes</span>
                  ) : (
                    <span className="text-primary-brightGreen">No</span>
                  )}
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  <AssetAction
                    asset={asset}
                    address={account?.address}
                    disabled={asset['is-frozen']}
                    type="send"
                  />
                  <AssetAction
                    asset={asset}
                    address={account?.address}
                    disabled={asset['is-frozen']}
                    className="pl-5"
                    type="remove"
                  />
                </div>
              </td>
            </tbody>
          ))}
        </>
      );
    }
    if (!account?.assets) {
      return <>{t('Wallet.asset.error')}</>;
    }
    return <Spinner />;
  };

  const thStyles = 'flex cursor-pointer text-sm items-center pb-3';

  return (
    <MainLayout title={t('head.Wallet.title')}>
      <div className="mt-16 grid  gap-8 md:grid-cols-4">
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
          <div>
            <Card>
              <Title size={5} as={2} className="mb-12">
                {t('Wallet.title')}
              </Title>
              {account?.address && (
                <Card padding={'sm'} rounded="sm" shadow={false}>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex w-full justify-between text-sm text-neutral-4">
                      <div>
                        <span> {t('Wallet.span')} #1 </span>
                      </div>
                      <div className="justify-items-end font-bold text-black">
                        <span className="px-4">{account?.address}</span>
                        <span className="text-primary-calmGreen">{t('Wallet.copy')}</span>
                      </div>
                    </div>
                    <hr className="w-full" />
                    <div className="flex w-full flex-row space-x-20 pt-4">
                      {/* TO DO: in this moment we only have ClimateCoins and Algos. 
                      The function getCoinsList() is made to show more coins when they exist in the wallet 
                      The function should receive an array of objects with label and value*/}
                      {/* {<CoinsList coinsList={account?.coins} />} */}
                      <div className="flex w-1/3 flex-col items-center">
                        <ul className="flex w-full flex-col space-y-4">
                          <div className="flex w-full justify-between">
                            <li className="text-neutral-4">Algorands</li>
                            <li>{account.amount}</li>
                          </div>
                        </ul>
                      </div>
                      <div className="flex w-2/3 flex-col justify-start space-y-4">
                        <div className="flex w-full items-center justify-between">
                          <span className="text-neutral-4">ClimateCoins</span>
                          <span className="text-4xl text-primary-brightGreen">
                            {formatToCC(climatecoinBalance())}
                          </span>
                        </div>
                        <SendFunds account={account} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="items-left flex flex-col space-y-3">
                        <Title size={5} as={5} className="mt-6">
                          {t('Wallet.table.title')}
                        </Title>
                        <table className="font-Poppins w-full text-sm font-medium text-primary">
                          <thead className="border-b-2 border-neutral-6 text-left text-xs text-neutral-4">
                            <th>
                              <div className={clsx(thStyles)} onClick={() => toggleSort('assetId')}>
                                {t('Wallet.filter.assetID')}
                                {renderArrow('assetId')}
                              </div>
                            </th>
                            <th>
                              <div className={clsx(thStyles)} onClick={() => toggleSort('amount')}>
                                {t('compensate.History.table.amount')} {renderArrow('amount')}
                              </div>
                            </th>
                            <th>
                              <div
                                className={clsx(thStyles)}
                                onClick={() => toggleSort('isFrozen')}
                              >
                                {t('Wallet.filter.freeze')} {renderArrow('isFrozen')}
                              </div>
                            </th>
                            <th className="flex justify-center">
                              <div className={clsx(thStyles)}> {t('Wallet.filter.actions')}</div>
                            </th>
                          </thead>
                          {renderNfts()}
                        </table>
                      </div>
                    </form>
                  </div>
                </Card>
              )}
            </Card>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};
