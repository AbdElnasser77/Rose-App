import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { TranslatePipe } from '@ngx-translate/core';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';
import { SectionTitleComponent } from '../../../../../shared/components/section-title/section-title.component';
import { TestimonialsService } from '../../../services/testimonials.service';
import { Testimonial } from '../../../models/testimonial.model';

@Component({
  selector: 'app-testimonial-section',
  imports: [CarouselModule, TestimonialCardComponent, SectionTitleComponent, TranslatePipe],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.scss',
})
export class TestimonialSectionComponent implements OnInit, OnDestroy {
  private testimonialsService = inject(TestimonialsService);
  private sub?: Subscription;

  testimonials = signal<Testimonial[]>([]);

  responsiveOptions = [
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '991px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 },
  ];

  ngOnInit() {
    this.sub = this.testimonialsService.getTestimonials().subscribe({
      next: (data) => {
        console.log(data);
        this.testimonials.set(data);
      },
      error: (err) => console.error('Testimonials API error:', err),
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
