import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UploadApiService } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';
import { switchMap } from 'rxjs';
import { DynamicFormComponent } from '../../../../shared/ui/dynamic-form/components/dynamic-form.component';
import { DynamicFormField } from '../../../../shared/ui/dynamic-form/models/dynamic-form-field.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-add-category-page',
  standalone: true,
  imports: [DynamicFormComponent, TranslatePipe],
  host: { class: 'flex flex-1 flex-col min-h-0' },
  templateUrl: './add-category.page.html',
})
export class AddCategoryPage {
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _uploadApiService = inject(UploadApiService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  readonly saving = signal(false);

  readonly fields: DynamicFormField[] = [
    {
      name: 'title',
      label: this._translateService.instant('DASHBOARD.CATEGORIES.NAME'),
      type: 'text',
      placeholder: this._translateService.instant(
        'DASHBOARD.CATEGORIES.NAME_PLACEHOLDER'
      ),
      required: true,
    },
    {
      name: 'image',
      label: this._translateService.instant('DASHBOARD.CATEGORIES.IMAGE'),
      type: 'file',
      accept: 'image/*',
      required: true,
    },
  ];

  onSubmit(value: Record<string, unknown>): void {
    const title = String(value['title'] ?? '').trim();
    const image = value['image'];

    if (!title || !(image instanceof File)) {
      return;
    }

    this.saving.set(true);

    // The API stores an uploaded path, not the binary - upload first, then
    // send the returned temp path as the category's `image`.
    this._uploadApiService
      .uploadImage(image)
      .pipe(
        switchMap((imagePath) =>
          this._categoriesService.createCategory({ title, image: imagePath })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe({
        next: () => {
          this.saving.set(false);
          this._toastService.show(
            this._translateService.instant('DASHBOARD.CATEGORIES.ADD_SUCCESS'),
            'success'
          );
          this._router.navigate(['/dashboard/categories']);
        },
        error: () => this.saving.set(false),
      });
  }
}
