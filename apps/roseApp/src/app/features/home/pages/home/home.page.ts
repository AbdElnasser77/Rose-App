import { Component } from '@angular/core';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';
import { FeaturesBarComponent } from '../../components/features-bar/features-bar.component';
import { TestimonialSectionComponent } from '../../components/Testimonial/testimonial-section/testimonial-section.component';
import { OccasionsComponent } from '../../components/banner/occasions/occasions.component';
import { HeroComponent } from '../../components/banner/hero/hero.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';

@Component({
  selector: 'app-home',
  imports: [
    TrustBadgesComponent,
    FeaturesBarComponent,
    TestimonialSectionComponent,
    OccasionsComponent,
    HeroComponent,
    GalleryComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
