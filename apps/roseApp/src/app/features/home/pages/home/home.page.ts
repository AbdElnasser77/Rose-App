import { Component } from '@angular/core';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';
import { FeaturesBarComponent } from '../../components/features-bar/features-bar.component';
import { OccasionsComponent } from '../../components/banner/occasions/occasions.component';

@Component({
  selector: 'app-home',
  imports: [TrustBadgesComponent,FeaturesBarComponent,OccasionsComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
