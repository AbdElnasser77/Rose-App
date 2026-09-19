import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormPageLayoutComponent } from '../../../../shared/ui/form-page-layout/components/form-page-layout.component';
import { ViewImageButtonComponent } from '../../../../shared/ui/view-image-button/components/view-image-button.component';
import { DynamicFormComponent } from '../../../../shared/ui/dynamic-form/components/dynamic-form.component';
import { DynamicFormField, DynamicFormOption } from '../../../../shared/ui/dynamic-form/models/dynamic-form-field.model';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '@org/shared-util-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../../../../shared/services/upload.service';
import { UpdateProductRequest } from '../../models/update-product-request.model';
import { ImagePreviewModalComponent } from '../../../../shared/ui/image-preview-modal/image-preview-modal.component';
import { OccasionsService } from '../../../occasionsa/services/occasions.service';
import { CategoriesService } from '../../../categories/services/categories.service';


@Component({
  selector: 'app-update-product-page',
  standalone: true,
  imports: [
    DynamicFormComponent,
    TranslatePipe,
    FormPageLayoutComponent,
    ViewImageButtonComponent,
    ImagePreviewModalComponent,
  ],
  templateUrl: './update-product.page.html',
  styleUrl: './update-product.page.scss',
})
export class UpdateProductPage implements OnInit  {
  private readonly _productsService = inject(ProductsService);
  private readonly _occasionsService = inject(OccasionsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _uploadService = inject(UploadService);
  private readonly _route = inject(ActivatedRoute);
  readonly productId = this._route.snapshot.paramMap.get('id');

  readonly productName = signal<string>('');
  readonly categoryOptions = signal<DynamicFormOption[]>([]);
  readonly occasionOptions = signal<DynamicFormOption[]>([]);
  readonly initialValues = signal<Record<string, unknown>>({});

  readonly productCover = signal<string | null>(null);
  readonly productGallery = signal<string[]>([]);
  readonly showCover = signal(false);
  readonly showGallery = signal(false);

  readonly coverImages = computed(() => {
    const cover = this.productCover();
    return cover ? [cover] : [];
  });

     ngOnInit(): void {
       const productId = this.productId;

    if (!productId) {
      return;
    }

    this.loadProduct(productId);
    this.loadCategories();
    this.loadOccasions();
    }


  readonly fields = computed<DynamicFormField[]>(() => [
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
      options:  this.occasionOptions(),
    },
  ]);

  onProductUpdate(data: Record<string, unknown>): void {
    if (!this.productId) {
    return;
  }

  const productData: UpdateProductRequest = {
    title: data['title'] as string,
    description: data['description'] as string,
    stock: Number(data['quantity']),
    price: Number(data['price']),
    discountType: 'PERCENT',
    discountValue: Number(data['discount'] ?? 0),
    categoryId: data['category'] as string,
  };

  this._productsService
    .updateProduct(this.productId, productData)
    .subscribe({
      next: () => {
        this._toastService.show(
      this._translateService.instant('DASHBOARD.PRODUCTS.UPDATE_SUCCESS'),
      'success'
      );
       this._router.navigate(['/dashboard/products']);
      }
      
    });
  }

  openCoverPreview(): void {
    this.showGallery.set(false);
    this.showCover.set(true);
  }

  openGalleryPreview(): void {
    this.showCover.set(false);
    this.showGallery.set(true);
  }

  closeCoverPreview(): void {
    this.showCover.set(false);
  }

  closeGalleryPreview(): void {
    this.showGallery.set(false);
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

private loadProduct(id: string): void {
    this._productsService.getProduct(id).subscribe({
      next: (response) => {
        const product = response.payload.product;
         this.productName.set(product.title);
         this.productCover.set(product.cover);

        this.productGallery.set(
          JSON.parse(product.gallery)
        );

        this.initialValues.set({
        title: product.title,
        description: product.description,
        price: product.price,
        discount:product.discountValue,
        quantity: product.stock,
        category: product.categoryId,
        occasion: product.occasions[0]?.occasionId
      });
      

    },
    });
  }

}