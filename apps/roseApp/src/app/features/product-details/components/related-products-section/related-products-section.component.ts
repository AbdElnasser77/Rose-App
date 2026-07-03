import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { ProductDataService } from '../../services/product-data-api.service';
import { RelatedProductsApiService, RelatedProductsParams } from '../../services/related-products-api.service';

@Component({
  selector: 'app-related-products-section',
  imports: [
    CommonModule,
    TranslatePipe,
    ProductCardComponent,
    SectionTitleComponent,
  ],
  templateUrl: './related-products-section.component.html',
  styleUrl: './related-products-section.component.scss',
})
export class RelatedProductsSectionComponent implements OnInit {
  @ViewChild('productsSlider') productsSlider!: ElementRef<HTMLDivElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productDataService = inject(ProductDataService);
  private readonly relatedProductsApiService = inject(RelatedProductsApiService);

  relatedProducts = signal<any[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadRelatedProducts();
  }

  loadRelatedProducts(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') || ''),
        filter((id) => !!id),
        switchMap((id) => {
          this.isLoading.set(true);

          return this.productDataService.getProductDetails(id).pipe(
            switchMap((res) => {
              const currentProduct = res?.payload?.product;
              const params = this.getRelatedProductsParams(currentProduct);

              return this.relatedProductsApiService.getRelatedProducts(params).pipe(
                map((productsRes) => {
                  const products = productsRes?.payload?.data || [];

                  return products
                    .filter((product: any) => product.id !== currentProduct?.id)
                    .slice(0, 10);
                })
              );
            }),
            catchError(() => {
              this.isLoading.set(false);
              return of([]);
            })
          );
        })
      )
      .subscribe({
        next: (products) => {
          this.relatedProducts.set(products);
          this.isLoading.set(false);
        },
      });
  }

  getRelatedProductsParams(product: any): RelatedProductsParams {
    const params: RelatedProductsParams = {
      limit: 10,
    };

    if (product?.subCategoryId) {
      params.subCategoryId = product.subCategoryId;
      return params;
    }

    if (product?.categoryId) {
      params.categoryId = product.categoryId;
      return params;
    }

    if (product?.occasions?.length) {
      params.occasionId = product.occasions[0]?.id;
      return params;
    }

    return params;
  }

  scrollProducts(direction: 'left' | 'right'): void {
    if (!this.productsSlider) return;

    const scrollAmount = 320;

    this.productsSlider.nativeElement.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  onCardDetailsClicked(product: any): void {
    const currentId = this.route.snapshot.paramMap.get('id');

    if (!currentId || !product?.id) return;

    const nextUrl = this.router.url.replace(currentId, product.id);
    this.router.navigateByUrl(nextUrl);
  }

  onWishListClicked(product: any): void {}

  onQuickViewClicked(product: any): void {}

  onAddToCartClicked(product: any): void {}
}