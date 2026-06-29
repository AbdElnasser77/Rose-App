import { Component } from '@angular/core';
import { TrustBadgeModel } from '../../models/trust-badge.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-trust-badges',
  imports: [CommonModule,TranslatePipe],
  templateUrl: './trust-badges.component.html',
  styleUrl: './trust-badges.component.scss',
})
export class TrustBadgesComponent {
  partners :TrustBadgeModel[]=[
    { name: 'Coconut', src: 'assets/trust-badges/coconut.svg', alt: 'Coconut Cosmetics' },
    { name: 'Ginyard', src: 'assets/trust-badges/ginyard.svg', alt: 'Ginyard' },
    { name: 'Ingoude', src: 'assets/trust-badges/ingoude.svg', alt: 'Ingoude ' },
    { name: 'Velvet', src: 'assets/trust-badges/velvet.svg', alt: 'Velvet Cosmetics' },
    { name: 'Ingoude Company', src: 'assets/trust-badges/ingoude-company.svg', alt: 'Ingoude Company' },
    { name: 'Habus', src: 'assets/trust-badges/habus.svg', alt: 'Habus Furniture' },
  ];
}
