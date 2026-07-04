import { Component, signal } from '@angular/core';
import { TrustBadgeModel } from '../../models/trust-badge.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';
import {IntersectionObserverDirective } from '@org/util-directives';
@Component({
  selector: 'app-trust-badges',
  imports: [CommonModule,TranslatePipe,AssetUrlPipe,IntersectionObserverDirective],
  templateUrl: './trust-badges.component.html',
  styleUrl: './trust-badges.component.scss',
})
export class TrustBadgesComponent {
  // Intersection observer
  
   isTrustVisible = signal<boolean>(false);
 onTrustVisible(event: any) {
    const isIntersecting = typeof event === 'boolean' ? event : event.isIntersecting;
    
    if (isIntersecting) {
      this.isTrustVisible.set(true);
    }
  }
  partners :TrustBadgeModel[]=[
    { name: 'Coconut', src: 'assets/images/trust-badges/coconut.svg', alt: 'Coconut Cosmetics' },
    { name: 'Ginyard', src: 'assets/images/trust-badges/ginyard.svg', alt: 'Ginyard' },
    { name: 'Ingoude', src: 'assets/images/trust-badges/ingoude.svg', alt: 'Ingoude ' },
    { name: 'Velvet', src: 'assets/images/trust-badges/velvet.svg', alt: 'Velvet Cosmetics' },
    { name: 'Ingoude Company', src: 'assets/images/trust-badges/ingoude-company.svg', alt: 'Ingoude Company' },
    { name: 'Habus', src: 'assets/images/trust-badges/habus.svg', alt: 'Habus Furniture' },
  ];
}
