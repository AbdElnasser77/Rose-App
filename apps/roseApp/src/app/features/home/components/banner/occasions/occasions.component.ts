import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetUrlPipe } from 'apps/roseApp/src/app/core/pipes/asset-url.pipe';
import { BadgeComponent } from "apps/roseApp/src/app/shared/components/badge/badge.component";

@Component({
  selector: 'app-occasions',
  imports: [AssetUrlPipe, BadgeComponent,TranslatePipe],
  templateUrl: './occasions.component.html',
  styleUrl: './occasions.component.scss',
})
export class OccasionsComponent {
  occasionsCards = [
    {
      badge: 'OCCASIONS.WEDDING.BADGE',
      title: 'OCCASIONS.WEDDING.TITLE',
      image: 'assets/images/banner/wedding.png'  
    },
    {
      badge: 'OCCASIONS.ENGAGEMENT.BADGE',
      title: 'OCCASIONS.ENGAGEMENT.TITLE',
      image: 'assets/images/banner/engagement.png'
    },
    {
      badge: 'OCCASIONS.ANNIVERSARY.BADGE',
      title: 'OCCASIONS.ANNIVERSARY.TITLE',
      image: 'assets/images/banner/anniversary.png'
    }
  ];
}
