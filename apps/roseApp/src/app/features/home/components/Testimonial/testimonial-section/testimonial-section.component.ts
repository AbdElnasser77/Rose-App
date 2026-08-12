import { Component, inject, OnInit,  signal, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';
import { SectionTitleComponent } from '../../../../../shared/components/section-title/section-title.component';
import { TestimonialsService } from '../../../services/testimonials.service';
import { Testimonial } from '../../../models/testimonial.model';
import { IntersectionObserverDirective } from '@org/util-directives';
import {  SwiperDirective } from '@org/util-directives';
import { SwiperOptions } from 'swiper/types';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-testimonial-section',
  imports: [CommonModule,  TestimonialCardComponent, SectionTitleComponent, 
    TranslatePipe, IntersectionObserverDirective,SwiperDirective ,LucideAngularModule],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.scss',
})
export class TestimonialSectionComponent implements OnInit {
  private testimonialsService = inject(TestimonialsService);
   private destroyRef = inject(DestroyRef);
  public _translateService = inject(TranslateService);

  testimonials = signal<Testimonial[]>([]);
  isTestimonialVisible = signal(false);

  readonly ChevronRight = ChevronRight ;
  readonly ChevronLeft = ChevronLeft ;
  readonly isRtl = computed(() => (this._translateService.currentLang()) === 'ar');

     get swiperConfig(): SwiperOptions {
      const rtl=this.isRtl();
      return{

        slidesPerView: 'auto',
        spaceBetween: 24,
        centerInsufficientSlides: true,
        watchSlidesProgress: true,



      navigation: {
       nextEl: rtl ? '.testimonial-prev' : '.testimonial-next',
       prevEl: rtl ? '.testimonial-next' : '.testimonial-prev',

      },

      }
      
    }

  ngOnInit() {
    this.testimonialsService.getTestimonials().pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (data) => {
       
        this.testimonials.set(data);
      }
    });
  }

  

  onTestimonialVisible(entry: IntersectionObserverEntry): void {
    if (entry.isIntersecting) {
      this.isTestimonialVisible.set(true);
    }
  }
}
