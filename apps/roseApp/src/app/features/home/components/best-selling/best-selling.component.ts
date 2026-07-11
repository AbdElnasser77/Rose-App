import { Component, computed, inject, OnInit, signal,CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ArrowRight,ArrowLeft, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '@org/ui';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { Product } from '../../../../shared/models/product.model';
import {IntersectionObserverDirective } from '@org/util-directives';
import { ProductDataService } from '../../../products/services/product-details/product-data-api.service';
import { SwiperDirective } from '@org/util-directives';
import { SwiperOptions } from 'swiper/types';

import { ToastService } from '@org/shared-util-notification';

@Component({
  selector: 'app-best-selling',
  imports: [
    CommonModule,
    CarouselModule,
    RatingModule,
    RouterModule,
    TranslatePipe,
    FormsModule,LucideAngularModule,ButtonComponent,ProductCardComponent ,
    IntersectionObserverDirective,CommonModule,SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './best-selling.component.html',
  styleUrl: './best-selling.component.scss',
})
export class BestSellingComponent implements OnInit {

  public _translateService = inject(TranslateService);
  private productService = inject(ProductDataService);
  private _router = inject(Router);
  private toastService = inject(ToastService);

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ArrowRight = ArrowRight;
  readonly ArrowLeft = ArrowLeft ;


  isBestSellingVisible = signal(false);
  products :Product[]=[];
  isRtl = computed(() => (this._translateService.currentLang()) === 'ar');


  wishlistedIds = signal<Set<string>>(new Set());

 
  ngOnInit(): void {
    this.getProducts();
  }

 
  getProducts(): void {
    this.productService.getProduct().subscribe({
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
    const current = new Set(this.wishlistedIds());
    if (current.has(id)) {
      current.delete(id);
      this.toastService.show('Product removed from wishlist', 'default');
    } else {
      current.add(id);
      this.toastService.show('Product added to wishlist', 'success');
    }
    this.wishlistedIds.set(current);
  }


onBestSellingVisible(entry: IntersectionObserverEntry) {
  if (entry.isIntersecting) {
    this.isBestSellingVisible.set(true);
  }
}
}
