import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetUrlPipe } from 'apps/roseApp/src/app/core/pipes/asset-url.pipe';
import { BadgeComponent } from "apps/roseApp/src/app/shared/components/badge/badge.component";
import {IntersectionObserverDirective } from '@org/util-directives';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-occasions',
  imports: [AssetUrlPipe, BadgeComponent,TranslatePipe
    ,CommonModule ,IntersectionObserverDirective],
  templateUrl: './occasions.component.html',
  styleUrl: './occasions.component.scss',
})
export class OccasionsComponent {
  // Intersection observer
  private occasionsVisibility = signal<boolean[]>([]);

  constructor() {
        this.occasionsVisibility.set(new Array(this.occasionsCards.length).fill(false));
  }
  
   onOccasionCardVisible(isVisible: boolean, index: number) {
    this.occasionsVisibility.update(visibility => {
      const newVisibility = [...visibility];
      newVisibility[index] = isVisible;
      return newVisibility;
    });
  }

  isOccasionVisible(index: number): boolean {
    return this.occasionsVisibility()[index];
  }
  occasionsCards = [
    {
      badge: 'OCCASIONS.WEDDING.BADGE',
      title: 'OCCASIONS.WEDDING.TITLE',
      image: 'assets/images/banner/wedding.webp'  
    },
    {
      badge: 'OCCASIONS.ENGAGEMENT.BADGE',
      title: 'OCCASIONS.ENGAGEMENT.TITLE',
      image: 'assets/images/banner/engagement.webp'
    },
    {
      badge: 'OCCASIONS.ANNIVERSARY.BADGE',
      title: 'OCCASIONS.ANNIVERSARY.TITLE',
      image: 'assets/images/banner/anniversary.webp'
    }
  ];
}
