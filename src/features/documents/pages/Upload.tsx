import { useTranslation } from 'react-i18next';

import { MainLayout } from '@/componentes/Layout/MainLayout';
import { PageTitle } from '@/componentes/Layout/PageTitle';

import { UploadForm } from '../components/UploadForm';

export const Upload = () => {
  const { t } = useTranslation();

  return (
    <MainLayout title={t('head.Upload.title')}>
      <PageTitle
        title={t('documents.Upload.title')}
        description={t('documents.Upload.description')}
        linkTo="/"
      />
      <UploadForm />
    </MainLayout>
  );
};
