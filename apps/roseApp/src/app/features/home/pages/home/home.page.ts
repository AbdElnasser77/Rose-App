import { Component } from '@angular/core';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';
import { FeaturesBarComponent } from '../../components/features-bar/features-bar.component';
import { OccasionsComponent } from '../../components/banner/occasions/occasions.component';
import { HeroComponent } from '../../components/banner/hero/hero.component';

@Component({
  selector: 'app-home',
  imports: [TrustBadgesComponent,FeaturesBarComponent,OccasionsComponent,HeroComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
