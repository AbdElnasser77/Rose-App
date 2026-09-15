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

export interface DynamicFormField<T = string> {
  name: string;
  label: string;
  type: DynamicFormFieldType;

  // Layout
  row?: string;

  // Basic
  /** Initial control value, e.g. when editing an existing record. */
  value?: string | number | null;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;

  // Validation
  min?: number;
  max?: number;
  pattern?: string;
  validators?: ValidatorFn[];

  // Textarea
  rows?: number;

  // Select
  options?: DynamicFormOption<T>[];

  // File
  accept?: string;
  /**
   * Optional link rendered under a file field - used to point at the file the
   * record already has, which a fresh upload would replace.
   */
  hintLabel?: string;
  hintHref?: string;
  maxFileSize?: number;
  multiple?: boolean;
}
