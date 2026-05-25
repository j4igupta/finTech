// Stubbed form components – minimal implementations for build
"use client";

import * as React from 'react';

export const Form = (props: any) => <form {...props} />;
export const FormItem = (props: any) => <div {...props} />;
export const FormLabel = (props: any) => <label {...props} />;
export const FormControl = (props: any) => <input {...props} />;
export const FormDescription = (props: any) => <p {...props} />;
export const FormMessage = (props: any) => <p {...props} />;
export const FormField = (props: any) => <input {...props} />;
export const useFormField = () => ({
  id: 'stub-id',
  name: 'stub',
  formItemId: 'stub-form-item',
  formDescriptionId: 'stub-form-desc',
  formMessageId: 'stub-form-msg',
  error: undefined,
});
