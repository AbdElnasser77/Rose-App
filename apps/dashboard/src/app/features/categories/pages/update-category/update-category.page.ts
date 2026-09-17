import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UploadApiService } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';
import { Observable, of, switchMap } from 'rxjs';
import { FormPageLayoutComponent } from '../../../../shared/ui/form-page-layout/components/form-page-layout.component';
import { ViewImageButtonComponent } from '../../../../shared/ui/view-image-button/components/view-image-button.component';
import { DynamicFormComponent } from '../../../../shared/ui/dynamic-form/components/dynamic-form.component';
import { ImagePreviewModalComponent } from '../../../../shared/ui/image-preview-modal/image-preview-modal.component';
import { DynamicFormField } from '../../../../shared/ui/dynamic-form/models/dynamic-form-field.model';
import { UpdateCategoryRequest } from '../../models/category-request.model';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-update-category-page',
  standalone: true,
  imports: [
    DynamicFormComponent,
    TranslatePipe,
    FormPageLayoutComponent,
    ViewImageButtonComponent,
    ImagePreviewModalComponent,
  ],
  templateUrl: './update-category.page.html',
})
export class UpdateCategoryPage implements OnInit {
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _uploadApiService = inject(UploadApiService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  readonly category = signal<CategoryModel | null>(null);
  readonly fields = signal<DynamicFormField[]>([]);
  readonly saving = signal(false);

  readonly showImage = signal(false);

  /** The preview modal takes a list, and a category has exactly one image. */
  readonly previewImages = computed(() => {
    const image = this.category()?.image;

    return image ? [this._uploadApiService.toAbsoluteUrl(image)] : [];
  });

  private categoryId = '';

  ngOnInit(): void {
    this.categoryId = this._route.snapshot.paramMap.get('id') ?? '';

    if (!this.categoryId) {
      this._router.navigate(['/dashboard/categories']);
      return;
    }

    this._categoriesService
      .getCategory(this.categoryId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.category.set(response.payload.category);
          this.buildFields(response.payload.category);
        },
      });
  }

  private buildFields(category: CategoryModel): void {
    // Keys only - the form translates labels and placeholders itself.
    this.fields.set([
      {
        name: 'title',
        label: 'DASHBOARD.CATEGORIES.NAME',
        type: 'text',
        placeholder: 'DASHBOARD.CATEGORIES.NAME_PLACEHOLDER',
        value: category.title,
        required: true,
      },
      {
        // Optional on edit: leaving it untouched keeps the current image.
        name: 'image',
        label: 'DASHBOARD.CATEGORIES.IMAGE',
        type: 'file',
        accept: 'image/*',
      },
    ]);
  }

  onSubmit(value: Record<string, unknown>): void {
    const title = String(value['title'] ?? '').trim();
    const image = value['image'];

    if (!title) {
      return;
    }

    this.saving.set(true);

    // Only a File means a replacement was picked; an untouched field leaves
    // the category's current image alone.
    const imagePath$: Observable<string | null> =
      image instanceof File
        ? this._uploadApiService.uploadImage(image)
        : of(null);

    imagePath$
      .pipe(
        switchMap((imagePath) => {
          const body: UpdateCategoryRequest = { title };

          if (imagePath) {
            body.image = imagePath;
          }

          return this._categoriesService.updateCategory(this.categoryId, body);
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe({
        next: () => {
          this.saving.set(false);
          this._toastService.show(
            this._translateService.instant(
              'DASHBOARD.CATEGORIES.UPDATE_SUCCESS'
            ),
            'success'
          );
          this._router.navigate(['/dashboard/categories']);
        },
        error: () => this.saving.set(false),
      });
  }

  openImagePreview(): void {
    this.showImage.set(true);
  }

  closeImagePreview(): void {
    this.showImage.set(false);
  }
}
