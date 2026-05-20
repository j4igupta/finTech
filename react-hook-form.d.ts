declare module 'react-hook-form' {
  import * as React from 'react';
  export type FieldPath<T> = any;
  export type FieldValues = any;
  export type UseFormReturn<T> = any;
  export const useForm: (options?: any) => UseFormReturn<any>;
export const FormProvider: React.ComponentType<any>;
export const useFormContext: () => any;
export const useFormState: () => any;
  export const Controller: React.ComponentType<any>;
export type ControllerProps = any;
}