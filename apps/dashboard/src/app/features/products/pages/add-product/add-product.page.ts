import { Component, computed, inject, OnInit, signal} from '@angular/core';
import { DynamicFormField, DynamicFormOption } from '../../../../shared/ui/dynamic-form/models/dynamic-form-field.model';
import { FormPageLayoutComponent } from '../../../../shared/ui/form-page-layout/components/form-page-layout.component';
import { DynamicFormComponent } from '../../../../shared/ui/dynamic-form/components/dynamic-form.component';
import { ProductsService } from '../../services/products.service';
import { CreateProductRequest } from '../../models/create-product-request.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { Router } from '@angular/router';
import { UploadService } from '../../../../shared/services/upload.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { OccasionsService } from '../../../occasionsa/services/occasions.service';
import { CategoriesService } from '../../../categories/services/categories.service';

@Component({
  selector: 'app-add-product-page',
  standalone: true,
  imports: [DynamicFormComponent, FormPageLayoutComponent],
  templateUrl: './add-product.page.html',
  styleUrl: './add-product.page.scss',
})
export class AddProductPage implements OnInit{
  private readonly _productsService = inject(ProductsService);
  private readonly _occasionsService = inject(OccasionsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _uploadService = inject(UploadService);
  
  categoryOptions = signal<DynamicFormOption[]>([]);
   occasionOptions = signal<DynamicFormOption[]>([]);

   ngOnInit(): void {
  this.loadCategories();
  this.loadOccasions();
}

fields = computed<DynamicFormField[]>(() => [
  {
    name: 'title',
    label: 'DASHBOARD.PRODUCTS.FIELDS.TITLE',
    type: 'text',
    placeholder: 'DASHBOARD.PRODUCTS.PLACEHOLDERS.TITLE',
    required: true,
  },

  {
    name: 'description',
    label: 'DASHBOARD.PRODUCTS.FIELDS.DESCRIPTION',
    type: 'textarea',
    placeholder: 'DASHBOARD.PRODUCTS.PLACEHOLDERS.DESCRIPTION',
    required: true,
    rows: 5,
  },

  {
    name: 'price',
    label: 'DASHBOARD.PRODUCTS.FIELDS.PRICE',
    type: 'number',
    placeholder: 'DASHBOARD.PRODUCTS.PLACEHOLDERS.PRICE',
    required: true,
    min: 0,
    row: 'pricing',
  },

  {
    name: 'discount',
    label: 'DASHBOARD.PRODUCTS.FIELDS.DISCOUNT',
    type: 'number',
    placeholder: 'DASHBOARD.PRODUCTS.PLACEHOLDERS.DISCOUNT',
    min: 0,
    max: 100,
    row: 'pricing',
  },

  {
    name: 'priceAfterDiscount',
    label: 'DASHBOARD.PRODUCTS.FIELDS.PRICE_AFTER_DISCOUNT',
    type: 'number',
    readonly: true,
    row: 'pricing',
    calculated:{
      dependsOn :['price','discount'],
      calculate : (values) =>{
        const price = Number(values['price'] ?? 0);
        const discount = Number(values['discount'] ?? 0);

         return price - (price * discount) / 100;

      }
    }
  },

  {
    name: 'quantity',
    label: 'DASHBOARD.PRODUCTS.FIELDS.QUANTITY',
    type: 'number',
    placeholder: 'DASHBOARD.PRODUCTS.PLACEHOLDERS.QUANTITY',
    required: true,
    min: 0,
  },

  {
    name: 'coverImage',
    label: 'DASHBOARD.PRODUCTS.FIELDS.COVER_IMAGE',
    type: 'file',
    required: true,
    accept: 'image/*',
    multiple: false,
    row: 'images',
  },

  {
    name: 'gallery',
    label: 'DASHBOARD.PRODUCTS.FIELDS.GALLERY',
    type: 'file',
    required: true,
    accept: 'image/*',
    multiple: true,
    maxFileSize: 5 * 1024 * 1024,
    row: 'images',
  },

  {
    name: 'category',
    label: 'DASHBOARD.PRODUCTS.FIELDS.CATEGORY',
    type: 'select',
    required: true,
    placeholder: 'DASHBOARD.PRODUCTS.PLACEHOLDERS.CATEGORY',
    options: this.categoryOptions(),
  },

  {
    name: 'occasion',
    label: 'DASHBOARD.PRODUCTS.FIELDS.OCCASION',
    type: 'select',
    placeholder: 'DASHBOARD.PRODUCTS.PLACEHOLDERS.OCCASION',
    options: this.occasionOptions(),
  },
]);

// Handle submit product form
onProductSubmit(data: Record<string, unknown>): void {
   const coverFile = data['coverImage'] as File;
  const galleryFiles = data['gallery'] as File[];
  
 forkJoin({
    cover: this.uploadCover(coverFile),
    gallery: this.uploadGallery(galleryFiles),
  })
  .pipe(
      switchMap(({ cover, gallery }) => {
        const productData: CreateProductRequest = {
          title: data['title'] as string,
          description: data['description'] as string,
          stock: Number(data['quantity']),
          price: Number(data['price']),
          discountType: 'PERCENT',
          discountValue: Number(data['discount']),
          categoryId: data['category'] as string,
          cover: cover,
          gallery: gallery,
        };

        return this._productsService.createProduct(productData);
      })
    ).subscribe({
    next: () => {
      this._toastService.show(
      this._translateService.instant('DASHBOARD.PRODUCTS.CREATE_SUCCESS'),
      'success'
    );
    this._router.navigate(['/dashboard/products']);
    }
  });
}

private loadCategories(): void {
  this._categoriesService.getCategories({ page: 1, limit: 100 }).subscribe((response) => {
    this.categoryOptions.set(
      response.payload.data.map((category: any) => ({
        label: category.title,
        value: category.id,
      }))
    );
  });
}

private loadOccasions(): void {
  this._occasionsService.getOccasions({ page: 1, limit: 100 }).subscribe((response) => {
    this.occasionOptions.set(
      response.payload.data.map((occasion: any) => ({
        label: occasion.title,
        value: occasion.id,
      }))
    );
  });
}
// uploadGallery
private uploadGallery(files: File[]): Observable<string[]> {
  return forkJoin(
    files.map((file) =>
      this._uploadService.uploadImage(file).pipe(
        map((response) => response.payload.url)
      )
    )
  );
}
// uploadCover
private uploadCover(file: File): Observable<string> {
  return this._uploadService.uploadImage(file).pipe(
    map((response) => response.payload.url)
  );
}
}