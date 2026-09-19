import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../../../shared/ui/dynamic-form/components/dynamic-form.component';
import { FormPageLayoutComponent } from '../../../../shared/ui/form-page-layout/components/form-page-layout.component';
import { Component, computed, inject,  signal} from '@angular/core';
import { DynamicFormField, DynamicFormOption } from '../../../../shared/ui/dynamic-form/models/dynamic-form-field.model';
import {  TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { UploadService } from '../../../../shared/services/upload.service';
import { OccasionsService } from '../../services/occasions.service';
import { OccasionsModel } from '../../models/occasions.model';

@Component({
  selector: 'app-add-occasions',
  imports: [DynamicFormComponent, FormPageLayoutComponent],
  templateUrl: './add-occasions.component.html'
})
export class AddOccasionsComponent {
  private readonly _occasionsService = inject(OccasionsService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _uploadService = inject(UploadService);

  occasionOptions = signal<DynamicFormOption[]>([]);

  fields = computed<DynamicFormField[]>(() => [
    {
      name: 'title',
      label: 'DASHBOARD.OCCASIONS.ENTER_TITLE',
      type: 'text',
      placeholder: 'DASHBOARD.OCCASIONS.ENTER_TITLE',
      required: true,
    },
    {
      name: 'image',
      label: 'DASHBOARD.OCCASIONS.IMAGE',
      type: 'file',
      required: true,
      accept: 'image/*',
      multiple: false,
      row: 'images',
    },
  ]);

  onOccasionsSubmit(data: Record<string, unknown>): void {
    const coverFile = data['image'] as File;
    
  forkJoin({
      cover: this.uploadCover(coverFile)
    })
    .pipe(
        switchMap(({ cover }) => {
          const occasionsData: OccasionsModel = {
            title: data['title'] as string,
            image: cover,
            description: "test"
          };

          return this._occasionsService.createOccasions(occasionsData);
        })
      ).subscribe({
      next: () => {
        this._toastService.show(
        this._translateService.instant('DASHBOARD.OCCASIONS.CREATE_SUCCESS'),
        'success'
      );
      this._router.navigate(['/dashboard/occasions']);
      },error:() =>  {
        //temp for demo
           this._router.navigate(['/dashboard/occasions']);
      }
    });
  }

  private uploadCover(file: File): Observable<string> {
    return this._uploadService.uploadImage(file).pipe(
      map((response) => response.payload.url)
    );
  }
}
