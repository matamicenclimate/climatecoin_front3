import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import useYupValidationResolver from './useValidationResolver';

interface FormProps {
  defaultValues?: any;
  children: React.ReactElement | React.ReactElement[];
  onSubmit: (data: any) => void;
  className?: string;
  validationSchema?: any;
}
export const Form = ({
  defaultValues,
  children,
  onSubmit,
  className,
  validationSchema = yup.object({}),
}: FormProps) => {
  const resolver = useYupValidationResolver(validationSchema);
  const methods = useForm({ defaultValues, resolver, mode: 'onBlur' });
  const { handleSubmit } = methods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {React.Children.map(children, (child) => {
        return child.props.name
          ? React.createElement(child.type, {
              ...{
                ...child.props,
                register: methods.register,
                control: methods.control,
                key: child.props.name,
                errors: methods.formState.errors,
              },
            })
          : child;
      })}
    </form>
  );
};
