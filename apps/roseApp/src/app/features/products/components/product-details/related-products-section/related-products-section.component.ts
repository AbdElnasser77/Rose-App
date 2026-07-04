import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card.component';
import { SectionTitleComponent } from '../../../../../shared/components/section-title/section-title.component';
import { ProductDataService } from '../../../services/product-details/product-data-api.service';
import {
  RelatedProductsApiService,
  RelatedProductsParams,
} from '../../../services/product-details/related-products-api.service';
import { Carousel } from "primeng/carousel";

@Component({
  selector: 'app-related-products-section',
  imports: [
    CommonModule,
    TranslatePipe,
    ProductCardComponent,
    SectionTitleComponent,
    Carousel
],
  templateUrl: './related-products-section.component.html',
  styleUrl: './related-products-section.component.scss',
})
export class RelatedProductsSectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productDataService = inject(ProductDataService);
  private readonly relatedProductsApiService = inject(RelatedProductsApiService);

  relatedProducts = signal<any[]>([]);
  isLoading = signal(false);

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

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

              return this.relatedProductsApiService
                .getRelatedProducts(params)
                .pipe(
                  map((productsRes) => {
                    const products = productsRes?.payload?.data || [];

                    return products
                      .filter(
                        (product: any) => product.id !== currentProduct?.id
                      )
                      .slice(0, 10);
                  })
                );
            }),
            catchError(() => {
              this.isLoading.set(false);
              return of([]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
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

  onCardDetailsClicked(product: any): void {
    this.router.navigate(['/products', product.id]);
  }

  onWishListClicked(product:any) {
    console.log('onWish')
  }

  onQuickViewClicked(product:any) {
    this.router.navigate(['/products', product.id]);
  }

  onAddToCartClicked(product:any) {
    console.log('onAddToCart')
  }
}