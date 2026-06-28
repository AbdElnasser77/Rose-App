import { Component } from '@angular/core';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges.component';

@Component({
  selector: 'app-home',
  imports: [TrustBadgesComponent,],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
