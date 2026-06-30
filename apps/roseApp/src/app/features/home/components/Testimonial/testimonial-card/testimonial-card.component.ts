import { Component, input } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User } from 'lucide-angular';

@Component({
  selector: 'app-testimonial-card',
  imports: [RatingModule, FormsModule, LucideAngularModule],
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.scss',
})
export class TestimonialCardComponent {
  name = input<string>('');
  content = input<string>('');
  rating = input<number>(5);
  image = input<string | null>(null);
  createdAt = input<string>('');

  readonly User = User;

  get formattedDate(): string {
    return new Date(this.createdAt()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
