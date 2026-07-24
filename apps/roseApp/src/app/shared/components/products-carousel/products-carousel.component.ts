import { CommonModule } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, output } from '@angular/core';
import {  TranslateService } from '@ngx-translate/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SectionTitleComponent } from '../section-title/section-title.component';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { SwiperDirective } from '@org/util-directives';
import { Product } from '../../models/product.model';
import { SwiperOptions } from 'swiper/types';
@Component({
  selector: 'app-products-carousel',
  imports: [CommonModule,
    ProductCardComponent,
    SectionTitleComponent,
    SwiperDirective,
    LucideAngularModule,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './products-carousel.component.html',
  styleUrl: './products-carousel.component.scss',
})
export class ProductsCarouselComponent {
   private readonly translateService = inject(TranslateService);

  readonly products = input.required<Product[]>();
  readonly wishlistedIds = input.required<Set<string>>();

  readonly mainTitle = input<string>('');
  readonly subTitle = input<string>('');

  readonly swiperConfig = input.required<SwiperOptions>();
  readonly prevButtonClass = input('swiper-button-prev-custom');
  readonly nextButtonClass = input('swiper-button-next-custom');

  readonly cardDetailsClicked = output<Product>();
  readonly wishListClicked = output<Product>();
  readonly quickViewClicked = output<Product>();
  readonly addToCartClicked = output<Product>();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly isRtl = computed(() => this.translateService.currentLang() === 'ar');
}
