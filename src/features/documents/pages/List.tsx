import clsx from 'clsx';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DataRenderer } from '@/componentes/DataRenderer/DataRenderer';
import { Button } from '@/componentes/Elements/Button/Button';
import { Link } from '@/componentes/Elements/Link/Link';
import { Pill, PillProps } from '@/componentes/Elements/Pill/Pill';
import { Title } from '@/componentes/Elements/Title/Title';
import { DayPickerRange } from '@/componentes/Form/DayPickerRange';
import { Input } from '@/componentes/Form/Inputs';
import { Icon } from '@/componentes/Icon/Icon';
import { Aside } from '@/componentes/Layout/Aside/Aside';
import { OperationsMenu } from '@/componentes/Layout/Aside/components/OperationsMenu';
import { MainLayout } from '@/componentes/Layout/MainLayout';
import { PageTitle } from '@/componentes/Layout/PageTitle';
import Popover from '@/componentes/Popover/Popover';
import { CarbonDocument } from '@/features/documents';
import { useSort } from '@/hooks/useSort';
import { useAuth } from '@/lib/auth';

import { PersonalMenu } from '../../../componentes/Layout/Aside/components/PersonalMenu';
import { useGetDocuments } from '../api/useGetDocuments';

const pillVariants: Record<string, PillProps['variant']> = {
  pending: 'new',
  minted: 'featured',
  swapped: 'comingSoon',
};

export const DocumentList = ({
  defaultFilter,
}: {
  defaultFilter?: { status: 'accepted' | 'completed' | undefined };
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const methods = useForm<any>({
    mode: 'onBlur',
    defaultValues: {
      ...defaultFilter,
    },
  });

  useEffect(() => {
    methods.setValue('status', defaultFilter?.status);
  }, [defaultFilter?.status]);

  const baseInputProps = {
    register: methods.register,
    control: methods.control,
    errors: methods.formState.errors,
    wrapperClassName: 'col-span-2',
  };

  const { sort, toggleSort, renderArrow } = useSort();
  const documents = useGetDocuments(methods.watch(), sort);

  const getProfileAvatar = () => {
    if (user?.avatar?.url) {
      return user?.avatar.url;
    }
    return 'avatar-placeholder.jpg';
  };

  const getProjectImage = (document: CarbonDocument) => {
    if (document?.thumbnail?.url) {
      return document.thumbnail.url;
    }
    return 'image-placeholder.png';
  };

  return (
    <MainLayout title={t('head.List.title')}>
      <PageTitle
        title={t('documents.List.title')}
        description={t('documents.Upload.description')}
        link={
          <Link to="/documents/upload" as="button" size="sm">
            {t('uploadDocuments.link')}
          </Link>
        }
      />
      <div className="grid gap-8 md:grid-cols-4">
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
            <div className="mb-10 flex items-center space-x-2">
              <Title size={4} as={3}>
                {t('documents.List.table.title')}
              </Title>
              <div className="flex-grow" />
              <Input
                name="title_contains"
                type="text"
                placeholder={t('documents.List.table.search')}
                inputClassName="border-2"
                iconRight={<Icon id="search-line" />}
                {...baseInputProps}
              />
              <div>
                <Popover>
                  <Popover.Button
                    render={(isOpen) => (
                      <Button type="button" variant={isOpen ? 'primary' : 'light'} size="sm">
                        {t('documents.List.table.filter')}
                        <Icon
                          id={isOpen ? 'calendar-line-white' : 'calendar-line'}
                          className="ml-3 h-4 w-4"
                        />
                      </Button>
                    )}
                  />
                  <Popover.Panel config={{ placement: 'bottom-end' }}>
                    <div className="p-4">
                      <DayPickerRange name="dates" {...baseInputProps} />
                    </div>
                  </Popover.Panel>
                </Popover>
              </div>
            </div>
            <table className="font-Poppins w-full text-sm font-medium text-neutral-4">
              <thead className="border-b-2 border-neutral-6 text-left text-xs text-neutral-4">
                <th>
                  <div
                    className={clsx('flex cursor-pointer items-center pb-4')}
                    onClick={() => toggleSort('title')}
                  >
                    {t('documents.List.table.projectImage')}
                  </div>
                </th>
                <th>
                  <div
                    className={clsx('flex cursor-pointer items-center pb-4')}
                    onClick={() => toggleSort('status')}
                  >
                    {t('documents.List.table.status')}
                    <div className="ml-1">{renderArrow('status')}</div>
                  </div>
                </th>
                <th>
                  <div
                    className={clsx('flex cursor-pointer items-center pb-4')}
                    onClick={() => toggleSort('title')}
                  >
                    {t('documents.List.table.projectName')}
                    <div className="ml-1">{renderArrow('title')}</div>
                  </div>
                </th>
                <th>
                  <div
                    className={clsx('flex cursor-pointer items-center pb-4')}
                    onClick={() => toggleSort('serial_number')}
                  >
                    {t('documents.List.table.transactions')}
                    <div className="ml-1">{renderArrow('serial_number')}</div>
                  </div>
                </th>
                {/* <th className="text-right">
                  <div className=" p-4">{t<string>('documents.List.table.transactions')}</div>
                </th> */}
                <th className="text-right">
                  <div
                    className={clsx('flex cursor-pointer justify-end pb-4')}
                    onClick={() => toggleSort('serial_number')}
                  >
                    {t<string>('documents.List.table.actions')}
                  </div>
                </th>
              </thead>
              <DataRenderer<CarbonDocument[]>
                data={documents}
                render={(model) => (
                  <tbody>
                    {model.map((document) => (
                      <tr key={document._id} className="text-left">
                        <td>
                          <div
                            style={{ backgroundImage: `url(${getProjectImage(document)})` }} // alt={document.data?.title}
                            className="h-11 w-16 rounded-lg bg-neutral-6 bg-cover bg-center "
                          />
                        </td>
                        <td>
                          <div className="flex py-3">
                            <Pill variant={pillVariants[document.status]}>{document.status}</Pill>
                          </div>
                        </td>
                        <td className="text-neutral-2">
                          <div className="flex flex-col">
                            <span>{document.title}</span>
                            <span className="text-xs text-neutral-4">
                              {document.developer_nft?.supply &&
                                `${document.developer_nft.supply} cc`}
                            </span>
                          </div>
                        </td>
                        <td>{document.serial_number}</td>
                        {/* <td className="text-right">
                          {document.fee_nft ? (
                            <Link to={`/documents/${document._id}/transactions`}>
                              {t('documents.List.transactions')}
                            </Link>
                          ) : (
                            t('documents.List.noTransactions')
                          )}
                        </td> */}
                        <td className="text-right">
                          <Link to={`/documents/${document._id}`}>
                            <span className="text-neutral-4">
                              {t('documents.List.viewDetails')}
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              />
            </table>
          </form>
        </main>
      </div>
    </MainLayout>
  );
};
