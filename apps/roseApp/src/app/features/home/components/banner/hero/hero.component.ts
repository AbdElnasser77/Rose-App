import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { AssetUrlPipe } from '../../../../../core/pipes/asset-url.pipe';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { LucideAngularModule, ArrowRight,ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-angular';
import {IntersectionObserverDirective } from '@org/util-directives';
import { CommonModule } from '@angular/common';
import { SwiperDirective } from '@org/util-directives';
import { SwiperOptions } from 'swiper/types';
import { Router } from '@angular/router';


@Component({
  selector: 'app-hero',
  imports: [AssetUrlPipe, BadgeComponent,ButtonComponent,CommonModule,
    IntersectionObserverDirective,LucideAngularModule,
    TranslatePipe,SwiperDirective ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  public _translateService = inject(TranslateService);
  private readonly router = inject(Router);

  @ViewChild('bannerSwiper')
  bannerSwiper!: ElementRef;
  
  readonly  ArrowRight= ArrowRight;
  readonly  ArrowLeft= ArrowLeft;
   readonly ChevronLeft = ChevronLeft;
   readonly ChevronRight = ChevronRight; 
  

  isBannerVisible = signal<boolean>(false);
  isRtl = computed(() => (this._translateService.currentLang()) === 'ar');
  currentPage = signal(0);

  // Intersection observer

  onBannerVisible(event: any) {
    const isIntersecting = typeof event === 'boolean' ? event : event.isIntersecting;
    
    if (isIntersecting) {
      this.isBannerVisible.set(true);
    }
  }
   get swiperConfig():SwiperOptions{
    const rtl=this.isRtl();
    
    return{
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      watchSlidesProgress: true,
      pagination: {
      clickable: true,
     },
      navigation: {
        nextEl: rtl ? '.hero-swiper-prev' : '.hero-swiper-next',
        prevEl: rtl ? '.hero-swiper-next' : '.hero-swiper-prev',
      }
    };
   }
  

  slides = [
    {
      image: 'assets/images/banner/slide_1_.webp',
      title: 'HERO.SLIDES.FIRST.TITLE',
      subTitle: 'HERO.SLIDES.FIRST.SUBTITLE'
    },
    {
      image: 'assets/images/banner/slide_2_.webp', 
      title: 'HERO.SLIDES.SECOND.TITLE',
      subTitle: 'HERO.SLIDES.SECOND.SUBTITLE'
    },
    {
      image: 'assets/images/banner/wedding.webp', 
      title: 'HERO.SLIDES.SECOND.TITLE',
      subTitle: 'HERO.SLIDES.SECOND.SUBTITLE'
    },
    {
      image: 'assets/images/banner/engagement.webp', 
      title: 'HERO.SLIDES.SECOND.TITLE',
      subTitle: 'HERO.SLIDES.SECOND.SUBTITLE'
    }
  ];
  
  
 goToProducts(): void {
  
  this.router.navigate(['/products']);
}

}
