import { ValidatorFn } from "@angular/forms";

export type DynamicFormInputType =
  | 'text'
  | 'password'
  | 'number'
  ;

export type DynamicFormFieldType = DynamicFormInputType | 'select' | 'textarea' |'file' ;

export interface DynamicFormOption<T = string> {
  label: string;
  value: T;
}
export interface DynamicFormCalculated {
  dependsOn: string[];
  calculate: (values: Record<string, unknown>) => unknown;
}

export interface DynamicFormField<T = string> {
  name: string;
  label: string;
  type: DynamicFormFieldType;

  // Layout
  row?: string;

  // Basic
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;

  // Validation
  min?: number;
  max?: number;
  pattern?: string;
  validators?: ValidatorFn[];

  //  calculated
  calculated?: DynamicFormCalculated;

  // Textarea
  rows?: number;

  // Select
  options?: DynamicFormOption<T>[];

  // File
  accept?: string;
  maxFileSize?: number;
  multiple?: boolean;
}
