import { Component, input } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-testimonial-card',
  imports: [RatingModule, FormsModule],
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.scss',
})
export class TestimonialCardComponent {
  name = input<string>('');
  role = input<string>('');
  message = input<string>('');
  rating = input<number>(4);

  date = input<string>('');
  avatarUrl = input<string>('');
}
