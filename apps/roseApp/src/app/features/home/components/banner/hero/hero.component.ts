import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { AssetUrlPipe } from '../../../../../core/pipes/asset-url.pipe';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { LucideAngularModule, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-angular';
import { Carousel, CarouselModule } from 'primeng/carousel';
import {IntersectionObserverDirective } from '@org/util-directives';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-hero',
  imports: [AssetUrlPipe, BadgeComponent,ButtonComponent,CommonModule,IntersectionObserverDirective,
    LucideAngularModule,CarouselModule,
    TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  public _translateService = inject(TranslateService);

  readonly  ArrowRight= ArrowRight;
   readonly ChevronLeft = ChevronLeft;
   readonly ChevronRight = ChevronRight; 
  
  // Intersection observer

   isBannerVisible = signal<boolean>(false);
  onBannerVisible(event: any) {
    const isIntersecting = typeof event === 'boolean' ? event : event.isIntersecting;
    
    if (isIntersecting) {
      this.isBannerVisible.set(true);
    }
  }

  isRtl = computed(() => (this._translateService.currentLang()) === 'ar');
  renderCarousel = signal(true);
  currentPage = signal(0);
  slides = signal([
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
  ]);
  
 
 constructor() {
    effect(() => {
      this._translateService.currentLang(); 
      
      this.renderCarousel.set(false);
      this.currentPage.set(0);

      setTimeout(() => {
        this.renderCarousel.set(true);
      }, 0);
    });
  }
}
