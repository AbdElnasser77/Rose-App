import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Image, LucideAngularModule, Upload } from 'lucide-angular';

import {ButtonComponent,ReusableInputComponent,SelectInputComponent,ValidationErrorsComponent,} from '@org/ui';
import {DynamicFormField,DynamicFormFieldType,DynamicFormInputType,} from '../models/dynamic-form-field.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,ButtonComponent,ReusableInputComponent,
    SelectInputComponent,ValidationErrorsComponent ,CommonModule,
    LucideAngularModule ,TranslatePipe
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
    private readonly destroyRef = inject(DestroyRef);
    readonly Upload =Upload;
    readonly Image = Image;
  form = new FormGroup({});
  fields = input<DynamicFormField[]>([]);
  submitLabel = input('COMMON.SUBMIT');
  initialValues = input<Record<string, unknown>>({});
  submitted = output<Record<string, unknown>>();

  // Initialization & Cleanup
  constructor() {
    effect(() => {
     this.fields();
     this.initialValues();

     this.form = this.createForm();
     this.setupCalculatedFields();
    });

    this.destroyRef.onDestroy(() => {
      this.cleanupFilePreviews();
    });
  }
  // Form Creation
  private createForm(): FormGroup {
  const controls: Record<string, FormControl> = {};

  for (const field of this.fields()) {
    controls[field.name] = new FormControl( {
        // Two ways to seed a control: the [initialValues] input (product forms)
        // and a value on the field itself (category forms). The input wins so a
        // caller can override a field's own default.
        value: this.initialValues()[field.name] ?? field.value ?? '',
        disabled: field.disabled ?? false,
      } ,this.getValidators(field));
  }

  return new FormGroup(controls);
 }
  // Validation
 private getValidators(field: DynamicFormField): ValidatorFn[] {
  const validators: ValidatorFn[] = [];

  if (field.required) {
    validators.push(Validators.required);
  }

  if (field.min !== undefined) {
    validators.push(Validators.min(field.min));
  }

  if (field.max !== undefined) {
    validators.push(Validators.max(field.max));
  }

  if (field.pattern) {
    validators.push(Validators.pattern(field.pattern));
  }

  if (field.validators) {
    validators.push(...field.validators);
  }

  return validators;
 }

  private readonly filePreviews = signal<Record<string, string[]>>({});
  private readonly selectedFiles = signal<Record<string, File[]>>({});

  
      // Check if the field is a standard input field
   isInputField(type: DynamicFormFieldType): type is DynamicFormInputType {
    return type === 'text' || type === 'password' || type === 'number';
  }

    // Get the control for validation errors
 getControl(fieldName:string){
    return this.form.get(fieldName);
  }
  
  // Handle file selection
  onFileSelected(event:Event,field: DynamicFormField): void{
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (!files.length) {
      return;
    }

    const control= this.getControl(field.name);

    if (!control) {
      return;
    }
    // Allow only images for gallery fields
  if (field.accept === 'image/*') {
    const  hasInvalidFile = files.some((file)=>!file.type.startsWith('image/'));
    
    if(hasInvalidFile){
      control.setErrors(
        {   ...control.errors,
          invalidFileType: true 
        });
      control.markAsTouched();
      return;
    }
  
  }
  // If multiple is enabled, keep all files
  // Otherwise, keep only the first file
  const selectedFiles = field.multiple ? files : [files[0]];

    this.selectedFiles.update((currentFiles)=>({
        ...currentFiles,
        [field.name]: selectedFiles,
    }));

     // Update form control value
    control.setValue(field.multiple ? selectedFiles : selectedFiles[0]);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();

    // Create previews for image files
     const previewUrls = selectedFiles
     .filter((file) => file.type.startsWith('image/'))
     .map((file) => URL.createObjectURL(file));


     const previousPreviews = this.filePreviews()[field.name] ?? [];
     previousPreviews.forEach((previewUrl) => {
     URL.revokeObjectURL(previewUrl);
     });

      // Store new previews
    this.filePreviews.update((currentPreviews) => ({
    ...currentPreviews,
    [field.name]: previewUrls,
    }));
  }

  getFilePreviews(fieldName: string): string[] {
     return this.filePreviews()[fieldName] ?? [];
  }


  //   Implement dynamic form submission
  onSubmit(): void {
    this.form.markAllAsTouched();
    
    if (this.form.invalid){
        return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  // Layout
  getFieldRows(): DynamicFormField[][] {
    const rows : DynamicFormField[][] = [];
    const rowMap = new Map<string, DynamicFormField[]>();

    for (const field of this.fields()) {
      if (!field.row) {
        rows.push([field]);
        continue;
      }

      const existingRow = rowMap.get(field.row);

      if (existingRow) { 
        existingRow.push(field); } 
      else { 
        const newRow = [field];
        rowMap.set(field.row, newRow); rows.push(newRow);
      }
    }
    return rows;
  }


  getRowGridClass(length: number): string {
  switch (length) {
    case 2:
      return 'md:grid-cols-2';

    case 3:
      return 'md:grid-cols-3';

    case 4:
      return 'md:grid-cols-4';

    default:
      return 'md:grid-cols-1';
  }
  }

 // Cleanup
  private cleanupFilePreviews(): void {
  Object.values(this.filePreviews()).forEach((previews) => {
    previews.forEach((previewUrl) => {
      URL.revokeObjectURL(previewUrl);
    });
  });
  }

  // CalculatedFields
  private setupCalculatedFields(): void {
    for (const field of this.fields()) {
    if (!field.calculated) {
      continue;
    }

    const controls = field.calculated.dependsOn
      .map((fieldName) => this.form.get(fieldName))
      .filter((control) => control !== null);

    if (!controls.length) {
      continue;
    }
     merge(
      ...controls.map((control) => control!.valueChanges)
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateCalculatedField(field);
      }); 

       // Calculate initial value
    this.updateCalculatedField(field);
   }

  }

  private updateCalculatedField(field: DynamicFormField): void {
  const values = this.form.getRawValue();

  const calculatedValue = field.calculated?.calculate(values);

  const control = this.form.get(field.name);

   control?.setValue(calculatedValue, {
  emitEvent: false,
   });

  }
  
}
