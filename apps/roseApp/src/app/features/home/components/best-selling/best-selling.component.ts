import { Component, computed, inject, OnInit, signal,CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, ElementRef, effect, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ArrowRight,ArrowLeft, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '@org/ui';
import { Product } from '../../../../shared/models/product.model';
import {IntersectionObserverDirective } from '@org/util-directives';
import { ProductDataService } from '../../../products/services/product-details/product-data-api.service';
import { SwiperOptions } from 'swiper/types';

import { ToastService } from '@org/shared-util-notification';
import { WishlistStore } from '../../../wishlist/store/wishlist.store';
import { CartService } from '../../../cart/services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsCarouselComponent } from 'apps/roseApp/src/app/shared/components/products-carousel/products-carousel.component';

@Component({
  selector: 'app-best-selling',
  imports: [
    CommonModule,
    CarouselModule,
    RatingModule,
    RouterModule,
    TranslatePipe,
    FormsModule,LucideAngularModule,ButtonComponent,
    IntersectionObserverDirective,CommonModule,ProductsCarouselComponent],
  templateUrl: './best-selling.component.html',
  styleUrl: './best-selling.component.scss',
})
export class BestSellingComponent implements OnInit {

  public _translateService = inject(TranslateService);
  private productService = inject(ProductDataService);
  private _router = inject(Router);
  private toastService = inject(ToastService);
  private readonly _wishlistStore = inject(WishlistStore);
  private readonly destroyRef = inject(DestroyRef);
  
  private cartService = inject(CartService);


  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ArrowRight = ArrowRight;
  readonly ArrowLeft = ArrowLeft ;


  isBestSellingVisible = signal(false);
  products :Product[]=[];
  isRtl = computed(() => (this._translateService.currentLang()) === 'ar');


  wishlistedIds = this._wishlistStore.wishlistedIds;

 
  ngOnInit(): void {
    this.getProducts();
  }

 
  getProducts(): void {
    this.productService.getProduct().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.products = res.payload.data;
    
      }
    });
  }
 

  get swiperConfig(): SwiperOptions {
    const rtl=this.isRtl();
    return{
      spaceBetween: 24,
    watchSlidesProgress: true,
    navigation: {
      nextEl: rtl ? '.best-selling-prev' : '.best-selling-next',
      prevEl: rtl ? '.best-selling-next' : '.best-selling-prev',
    },
    breakpoints: {
      0: {
        slidesPerView: 1, 
      } ,
      768: {
      slidesPerView: 2,
      spaceBetween: 18,
      },
      1280: {
        slidesPerView: 3, 
        spaceBetween: 24,     
      },
    },

    }
    
  }
  

  handleCardClicked(productId: string){
    this._router.navigate(['/products', productId]);

  }


  onWishlist(id: string): void {
    const wasWishlisted = this._wishlistStore.isWishlisted(id);

    this._wishlistStore.toggle(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next : () =>{
        this.toastService.show(
          this._translateService.instant(
            wasWishlisted ? 'WISHLIST.ITEM_REMOVED' : 'WISHLIST.ITEM_ADDED'
          ),
           wasWishlisted ? 'default' : 'success'
        );
      }
    });
  }


onBestSellingVisible(entry: IntersectionObserverEntry) {
  if (entry.isIntersecting) {
    this.isBestSellingVisible.set(true);
  }
}

  onAddToCartClicked(id:any) {
    this.cartService.addToCart({ productId: id, quantity: 1 }).pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: any) => {
          if (res.message == "Insufficient stock.") {
            this.toastService.show('out of the stock', 'success');
          } else {
            this.toastService.show('product added to cart', 'success');
          }
        },
      });
  }
}
