import { Component } from '@angular/core';

import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';
import { FeaturesBarComponent } from '../../components/features-bar/features-bar.component';
import { AboutUsComponent } from '../../../components/about-us/about-us.component';

@Component({
  selector: 'app-home',
  imports: [
    AboutUsComponent,
    TrustBadgesComponent,
    FeaturesBarComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
