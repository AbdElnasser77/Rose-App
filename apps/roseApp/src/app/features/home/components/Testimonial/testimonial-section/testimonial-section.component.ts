import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';

export interface Testimonial {
  name: string;
  role: string;
  message: string;
  rating: number;
  date: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-testimonial-section',
  imports: [CarouselModule, TestimonialCardComponent],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.scss',
})
export class TestimonialSectionComponent {
  testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      message: "I've been ordering from this flower shop for years and they never disappoint. The quality and service are exceptional!",
      rating: 5,
      date: 'January 12, 2025',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Jake Miller',
      role: 'Wedding Planner',
      message: 'Absolutely stunning arrangements! They made our wedding day unforgettable. Every bouquet was perfect.',
      rating: 4,
      date: 'February 3, 2025',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Emily Davis',
      role: 'Event Coordinator',
      message: 'Fast delivery, fresh flowers, and beautiful packaging. I always recommend this shop to everyone.',
      rating: 5,
      date: 'March 20, 2025',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Michael Brown',
      role: 'Loyal Customer',
      message: 'The roses I ordered were fresh for over two weeks! Outstanding quality and lovely presentation.',
      rating: 4,
      date: 'April 5, 2025',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
    },
  ];

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '480px', numVisible: 1, numScroll: 1 },
  ];
}