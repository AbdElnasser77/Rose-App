import { Component } from '@angular/core';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';
import { FeaturesBarComponent } from '../../components/features-bar/features-bar.component';
import { MostPopularSectionComponent } from "../../components/most-popular-section/most-popular-section.component";

@Component({
  selector: 'app-home',
  imports: [TrustBadgesComponent, FeaturesBarComponent, MostPopularSectionComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
