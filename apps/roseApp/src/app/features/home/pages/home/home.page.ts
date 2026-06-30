import { Component } from '@angular/core';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';
import { FeaturesBarComponent } from '../../components/features-bar/features-bar.component';
import { TestimonialSectionComponent } from '../../components/Testimonial/testimonial-section/testimonial-section.component';

@Component({
  selector: 'app-home',
  imports: [
    TrustBadgesComponent,
    FeaturesBarComponent,
    TestimonialSectionComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
