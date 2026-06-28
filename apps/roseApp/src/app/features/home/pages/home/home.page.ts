import { Component } from '@angular/core';
import { TestimonialSectionComponent } from '../../components/Testimonial/testimonial-section/testimonial-section.component';

@Component({
  selector: 'app-home',
  imports: [TestimonialSectionComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
