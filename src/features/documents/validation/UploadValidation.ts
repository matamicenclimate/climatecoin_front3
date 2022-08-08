import * as yup from 'yup';

const DOCUMENTS_SUPPORTED_FORMATS = ['application/pdf'];
const IMAGES_SUPPORTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const dateValidation = yup
  .date()
  .nullable()
  .transform((current, origin) => (origin === '' ? null : current));

const fileInputValidation = yup
  .array()
  .nullable()
  .test('format', 'validation.errors.format.document', (value) => {
    if (!value) return true;

    const fileTypes = value.map((file) => file.type);
    const hasErrors = fileTypes
      .map((type) => DOCUMENTS_SUPPORTED_FORMATS.includes(type))
      .includes(false);

    return !hasErrors;
  });

const imageValidation = yup.array().test('format', 'validation.errors.format.image', (value) => {
  if (!value) return false;
  if (value.length === 0) return false;

  const fileTypes = value.map((file) => file.type);
  const hasErrors = fileTypes
    .map((type) => IMAGES_SUPPORTED_FORMATS.includes(type))
    .includes(false);

  return !hasErrors;
});

export const documentUploadValidationSchema = yup.object({
  project_type: yup.object().nullable().required(),
  title: yup.string().required(),
  sdgs: yup.array().nullable(),
  description: yup.string().required(),
  country: yup.object().nullable().nullable().required(),
  project_url: yup.string().required(),
  project_latitude: yup.string().nullable(),
  project_longitude: yup.string().nullable(),
  thumbnail: imageValidation.required(),
  cover: imageValidation.required(),
  project_registration: dateValidation.required(),
  project_video: yup.string(),
  type: yup.object().nullable().required(),
  sub_type: yup.object().nullable().required(),
  methodology: yup.object().nullable(),
  credit_start: dateValidation.required(),
  credit_end: dateValidation.required(),
  validator: yup.object().nullable(),
  first_verifier: yup.object().nullable(),
  standard: yup.object().nullable().required(),
  registry: yup.object().nullable().required(),
  credits: yup.string().required(),
  serial_number: yup.string().required(),
  registry_url: yup.string().required(),
  pdd: fileInputValidation.min(1),
  validation_report: fileInputValidation,
  monitoring_report: fileInputValidation,
  verification_report: fileInputValidation.min(1),
  confirmation: yup.boolean().isTrue(),
});

export type UploadFormSchema = yup.InferType<typeof documentUploadValidationSchema>;
