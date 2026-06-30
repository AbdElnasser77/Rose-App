import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { TestimonialCardComponent } from '../testimonial-card/testimonial-card.component';
import { AssetUrlPipe } from '../../../../../core/pipes/asset-url.pipe';

export interface Testimonial {
  id: string;
  name: string;
  email: string;
  content: string;
  rating: number;
  image: string | null;
  isApproved: boolean;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-testimonial-section',
  imports: [CarouselModule, TestimonialCardComponent, AssetUrlPipe],
  templateUrl: './testimonial-section.component.html',
  styleUrl: './testimonial-section.component.scss',
})
export class TestimonialSectionComponent {
  testimonials: Testimonial[] = [
    {
      id: '3ff0a7ec-dbee-4d05-8812-65bdf3916fef',
      name: 'yasmine',
      email: 'yasminaemad16@gmail.com',
      content: 'good',
      rating: 4,
      image: null,
      isApproved: false,
      immutable: false,
      createdAt: '2026-06-27T20:16:33.739Z',
      updatedAt: '2026-06-27T20:16:33.739Z',
    },
    {
      id: '71cc185a-e4af-4d07-9b9d-9191d7cbe6e0',
      name: 'hady',
      email: 'hadywahba19@gmail.com',
      content: 'good',
      rating: 4,
      image: 'https://www.rose-app.elevate-bootcamp.cloud/storage/entities/testimonial/testimonial-b9bd28543d8c-1778073895826.png',
      isApproved: false,
      immutable: false,
      createdAt: '2026-05-06T13:24:55.827Z',
      updatedAt: '2026-05-06T13:24:55.827Z',
    },
    {
      id: '9d39d700-6fef-472b-a2f7-e81a36e054f6',
      name: 'hady',
      email: 'hadywahba19@gmail.com',
      content: 'nice❤',
      rating: 5,
      image: 'https://www.rose-app.elevate-bootcamp.cloud/storage/entities/testimonial/testimonial-d8d9ab1e2693-1778073601315.jpeg',
      isApproved: false,
      immutable: false,
      createdAt: '2026-05-06T13:20:01.319Z',
      updatedAt: '2026-05-06T13:20:01.319Z',
    },
    {
      id: '882ce485-2f92-4b4f-92c2-a1bbe7121c6c',
      name: 'hesham',
      email: 'heshamwahba24@gmail.com',
      content: 'very good',
      rating: 4,
      image: null,
      isApproved: false,
      immutable: false,
      createdAt: '2026-05-06T13:19:00.983Z',
      updatedAt: '2026-05-06T13:19:00.983Z',
    },
    {
      id: '014fbb58-51e8-4368-87d9-b4b0aaed36f2',
      name: 'yasmina',
      email: 'yasmina@gmail.com',
      content: 'good',
      rating: 5,
      image: null,
      isApproved: false,
      immutable: false,
      createdAt: '2026-05-06T13:18:21.396Z',
      updatedAt: '2026-05-06T13:18:21.396Z',
    },
    {
      id: 'a2bac917-d4d9-4f30-b039-e54c4c443322',
      name: 'asmaa',
      email: 'asmaaTa3lab26@gmail.com',
      content: 'very good',
      rating: 5,
      image: null,
      isApproved: false,
      immutable: false,
      createdAt: '2026-05-06T13:12:01.586Z',
      updatedAt: '2026-05-06T13:12:01.586Z',
    },
  ];

  responsiveOptions = [
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '991px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 },
  ];
}
