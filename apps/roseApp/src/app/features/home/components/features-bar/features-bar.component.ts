import { Component, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@org/ui';
import { Headset, LucideAngularModule, RefreshCw, ShieldCheck, Truck } from 'lucide-angular';
import {IntersectionObserverDirective } from '@org/util-directives';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-bar',
  imports: [ButtonComponent,LucideAngularModule,TranslatePipe,IntersectionObserverDirective,CommonModule],
  templateUrl: './features-bar.component.html',
  styleUrl: './features-bar.component.scss',
})
export class FeaturesBarComponent {
 // Intersection observer
   private featuresVisibility = signal<boolean[]>([]);

    constructor() {
    this.featuresVisibility.set(new Array(this.features.length).fill(false));
  }
  onFeatureCardVisible(isVisible: boolean, index: number) {
    this.featuresVisibility.update(visibility => {
      const newVisibility = [...visibility];
      newVisibility[index] = isVisible;
      return newVisibility;
    });
  }

  isFeatureVisible(index: number): boolean {
    return this.featuresVisibility()[index];
  }
   
  
  features = [
    { icon: Truck, title: 'FEATURES.FREE_DELIVERY_TITLE', desc: 'FEATURES.FREE_DELIVERY_DESC' },
    { icon: RefreshCw, title: 'FEATURES.GET_REFUND_TITLE', desc: 'FEATURES.GET_REFUND_DESC' },
    { icon: ShieldCheck, title: 'FEATURES.SAFE_PAYMENT_TITLE', desc:'FEATURES.SAFE_PAYMENT_DESC' },
    { icon: Headset, title: 'FEATURES.SUPPORT_TITLE', desc: 'FEATURES.SUPPORT_DESC' }
  ];
}
