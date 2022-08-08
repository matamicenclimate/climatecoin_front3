import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/componentes/Card/Card';
import { Button } from '@/componentes/Elements/Button/Button';
import { Link } from '@/componentes/Elements/Link/Link';
import { Spinner } from '@/componentes/Elements/Spinner/Spinner';
import { Title } from '@/componentes/Elements/Title/Title';
import { SelectOption } from '@/componentes/Form';
import FileInput from '@/componentes/Form/FileInput';
import { Input, Textarea } from '@/componentes/Form/Inputs';
import { Select } from '@/componentes/Form/Select';
import { Switch } from '@/componentes/Form/Switch';
import useYupValidationResolver from '@/componentes/Form/useValidationResolver';
import { Icon } from '@/componentes/Icon/Icon';
import { Stepper, useStepper } from '@/componentes/Stepper/Stepper';

import { FormOption, useGetFormOptions } from '../api/useGetFormOptions';
import { useUploadDocument } from '../api/useUploadDocument';
import { ProjectPreview } from '../components/ProjectPreview';
import { documentUploadValidationSchema, UploadFormSchema } from '../validation/UploadValidation';

/*
 * esto esta feo,
 * pero jest no "furula" con el build de es-modules de react-leaflet
 */
let FormMap: any = () => null;
if (process.env.NODE_ENV !== 'test') {
  import('../components/Map').then((module) => (FormMap = module.FormMap));
}

const formOptionToSelectOption = (options: FormOption[] | undefined): SelectOption[] => {
  if (options === undefined) return [];
  return options.map((option) => ({
    value: option.id,
    label: option.name,
  }));
};

export enum UploadSteps {
  INFO = 0,
  DETAILS = 1,
  CONFIG = 2,
  FILES = 3,
  CONFIRMATION = 4,
}

export const UploadForm = () => {
  const { t } = useTranslation();

  const resolver = useYupValidationResolver(documentUploadValidationSchema);
  const methods = useForm<UploadFormSchema>({
    resolver,
    mode: 'onBlur',
    // TODO: our validation schema is not great,
    //  if the file inputs haven't been mounted the validation doesnt work for these fields
    defaultValues: {
      pdd: [],
      verification_report: [],
    },
  });

  const uploadDocuments = useUploadDocument();
  const formOption = useGetFormOptions();
  const { currStep, nextStep, prevStep, setCurrStep } = useStepper(UploadSteps);
  const navigate = useNavigate();
  const handleSubmit = async (data: UploadFormSchema) => {
    const res = await uploadDocuments.mutateAsync(data);
    navigate(`/documents/${res._id}`);
  };

  const baseInputProps = {
    register: methods.register,
    control: methods.control,
    errors: methods.formState.errors,
    wrapperClassName: 'col-span-2',
  };

  // Se podria memoizar
  const renderStepperNavigation = () => (
    <div className="col-span-2 grid grid-cols-3">
      {currStep !== 0 ? (
        <Button variant="light" type={undefined} onClick={prevStep}>
          {t<string>('documents.Upload.stepper.back')}
        </Button>
      ) : (
        <div />
      )}
      {uploadDocuments.isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div />
      )}
      {currStep === UploadSteps.CONFIRMATION ? (
        <Button
          type="submit"
          size="md"
          disabled={uploadDocuments.isLoading || !methods.watch('confirmation')}
        >
          {t<string>('documents.Upload.stepper.send')}
        </Button>
      ) : (
        <Button type={undefined} onClick={nextStep}>
          {t<string>('documents.Upload.stepper.continue')}
        </Button>
      )}
    </div>
  );

  function getErrorFromKeys<FormSchema extends Record<string, unknown>>(
    array: (keyof FormSchema)[]
  ) {
    return array.reduce((acc, key) => {
      return acc || Object.keys(methods.formState.errors).includes(key as string);
    }, false);
  }

  return (
    <div className="grid md:grid-cols-3">
      <div id="left-column-wrapper" className="">
        <Stepper
          stepsEnum={UploadSteps}
          errors={{
            INFO: getErrorFromKeys<UploadFormSchema>([
              'title',
              'country',
              'sdgs',
              'title',
              'description',
              'project_url',
            ]),
            CONFIG: getErrorFromKeys<UploadFormSchema>([
              'credit_start',
              'credit_end',
              'type',
              'sub_type',
              'methodology',
              'validator',
              'first_verifier',
              'standard',
              'registry',
              'registry_url',
            ]),
            DETAILS: getErrorFromKeys<UploadFormSchema>([
              'project_latitude',
              'project_longitude',
              'thumbnail',
              'cover',
              'credits',
              'serial_number',
              'project_registration',
              'project_video',
            ]),
            FILES: getErrorFromKeys<UploadFormSchema>([
              'pdd',
              'validation_report',
              'monitoring_report',
              'verification_report',
            ]),
            CONFIRMATION: false,
          }}
          setCurrStep={setCurrStep}
          currStep={currStep}
          translationRoot="documents.Upload.stepper"
        />
      </div>
      <div className="md:col-span-2">
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          {currStep === UploadSteps.INFO ? (
            <Card>
              <Title size={5} as={2}>
                {t('documents.Upload.stepper.INFO')}
              </Title>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <Select<UploadFormSchema>
                  {...{
                    ...baseInputProps,
                    name: 'project_type',
                    options: formOptionToSelectOption(formOption.data?.['project-types']),
                    label: t('uploadDocuments.project.type'),
                    wrapperClassName: '',
                  }}
                  required
                />
                <Select<UploadFormSchema>
                  {...{
                    ...baseInputProps,
                    options: formOptionToSelectOption(formOption.data?.countries),
                    label: t('uploadDocuments.country'),
                    name: 'country',
                    wrapperClassName: '',
                  }}
                  required
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.sdgs')}
                  tooltipInfo={t('uploadDocuments.sdgs')}
                  name="sdgs"
                  options={formOptionToSelectOption(formOption.data?.sdgs)}
                  isMulti
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.project.title')}
                  required
                  name="title"
                  type="text"
                />
                <Textarea<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.description')}
                  required
                  name="description"
                  type="text"
                  placeholder="Write description here..."
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.project.url')}
                  required
                  name="project_url"
                  type="text"
                  placeholder="https://"
                />
                {renderStepperNavigation()}
              </div>
            </Card>
          ) : null}
          {/** Hide the DIV with css instead of unmounting it so that we dont loose the value of the FileInputs */}
          {currStep === UploadSteps.DETAILS ? (
            <Card>
              <Title size={5} as={2}>
                {t('documents.Upload.stepper.DETAILS')}
              </Title>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.projectLatitude')}
                  name="project_latitude"
                  type="number"
                  step="any"
                  defaultValue={0}
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.projectLongitude')}
                  name="project_longitude"
                  type="number"
                  step="any"
                  defaultValue={0}
                />
                <div className="md:col-span-2">
                  {!!FormMap && (
                    <FormMap
                      lat={
                        methods.watch('project_latitude')
                          ? Number(methods.watch('project_latitude'))
                          : 0
                      }
                      lng={
                        methods.watch('project_longitude')
                          ? Number(methods.watch('project_longitude'))
                          : 0
                      }
                    />
                  )}
                </div>
                <FileInput<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.projectThumbnail')}
                  required
                  name="thumbnail"
                  accept=".png,.jpg,.jpeg"
                />
                <FileInput<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.projectCover')}
                  required
                  name="cover"
                  accept=".png,.jpg,.jpeg"
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.credits.amount')}
                  required
                  name="credits"
                  type="number"
                  iconLeft={<Icon id="cube" />}
                  placeholder="Eg: 10000"
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.serialNumber')}
                  required
                  name="serial_number"
                  type="text"
                  iconLeft={<Icon id="key" />}
                  placeholder="0x0043254it34537564"
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.project.registration')}
                  required
                  name="project_registration"
                  type="date"
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  label={t('uploadDocuments.project.video')}
                  name="project_video"
                  type="text"
                  placeholder="Eg: https://youtube.com?v=32jmfdskj3kr3"
                />
                {renderStepperNavigation()}
              </div>
            </Card>
          ) : null}
          {currStep === UploadSteps.CONFIG ? (
            <Card>
              <Title size={5} as={2}>
                {t('documents.Upload.stepper.CONFIG')}
              </Title>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {' '}
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.project.creditStart')}
                  required
                  name="credit_start"
                  type="date"
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.project.creditEnd')}
                  required
                  name="credit_end"
                  type="date"
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.type')}
                  required
                  name="type"
                  options={formOptionToSelectOption(formOption.data?.types)}
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.subtype')}
                  required
                  name="sub_type"
                  options={formOptionToSelectOption(formOption.data?.['sub-types'])}
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.methodology')}
                  name="methodology"
                  tooltipInfo={t('uploadDocuments.methodology')}
                  options={formOptionToSelectOption(formOption.data?.methodologies)}
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.validator')}
                  name="validator"
                  tooltipInfo={t('uploadDocuments.validator')}
                  options={formOptionToSelectOption(formOption.data?.validators)}
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.firstVerifier')}
                  name="first_verifier"
                  tooltipInfo={t('uploadDocuments.firstVerifier')}
                  options={formOptionToSelectOption(formOption.data?.['first-verifiers'])}
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.standard')}
                  required
                  name="standard"
                  tooltipInfo={t('uploadDocuments.standard')}
                  options={formOptionToSelectOption(formOption.data?.standards)}
                />
                <Select<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-1"
                  label={t('uploadDocuments.registry.name')}
                  required
                  name="registry"
                  tooltipInfo={t('uploadDocuments.registry.name')}
                  options={formOptionToSelectOption(formOption.data?.registries)}
                />
                <Input<UploadFormSchema>
                  {...baseInputProps}
                  wrapperClassName="col-span-2"
                  label={t('uploadDocuments.registry.link')}
                  required
                  name="registry_url"
                  type="text"
                  placeholder="https://"
                />
                {renderStepperNavigation()}
              </div>
            </Card>
          ) : null}
          {currStep === UploadSteps.FILES ? (
            <div className={''}>
              <Card>
                <Title size={5} as={2}>
                  {t('documents.Upload.stepper.FILES')}
                </Title>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <FileInput<UploadFormSchema>
                    {...baseInputProps}
                    wrapperClassName="col-span-2"
                    label={t('uploadDocuments.PDD')}
                    required
                    name="pdd"
                    accept=".pdf"
                  />
                  <FileInput<UploadFormSchema>
                    {...baseInputProps}
                    wrapperClassName="col-span-2"
                    label={t('uploadDocuments.validation.report')}
                    name="validation_report"
                    accept=".pdf"
                  />
                  <FileInput<UploadFormSchema>
                    {...baseInputProps}
                    wrapperClassName="col-span-2"
                    label={t('uploadDocuments.monitoring.report')}
                    name="monitoring_report"
                    accept=".pdf"
                  />
                  <FileInput<UploadFormSchema>
                    {...baseInputProps}
                    label={t('uploadDocuments.verification.report')}
                    required
                    name="verification_report"
                    accept=".pdf"
                  />
                  {renderStepperNavigation()}
                </div>
              </Card>
            </div>
          ) : null}
          {currStep === UploadSteps.CONFIRMATION ? (
            <Card>
              <Title size={5} as={2}>
                {t(`documents.Upload.stepper.CONFIRMATION`)}
              </Title>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <ProjectPreview values={methods.getValues()} />
                </div>
                <div className="col-span-2 text-xs">
                  <Switch
                    control={methods.control}
                    name="confirmation"
                    label={
                      <>
                        {t('documents.Upload.confirmationTextPre')}{' '}
                        <Link to="/terms-conditions">
                          {t('documents.Upload.confirmationTextLink')}
                        </Link>{' '}
                        {t('documents.Upload.confirmationTextPost')}
                      </>
                    }
                  />
                </div>
                {renderStepperNavigation()}
              </div>
            </Card>
          ) : null}
        </form>
      </div>
    </div>
  );
};
