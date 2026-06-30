import { Component } from '@angular/core';
import { AssetUrlPipe } from 'apps/roseApp/src/app/core/pipes/asset-url.pipe';

@Component({
  selector: 'app-occasions',
  imports: [AssetUrlPipe],
  templateUrl: './occasions.component.html',
  styleUrl: './occasions.component.scss',
})
export class OccasionsComponent {
  occasionsCards = [
    {
      badge: 'Wedding',
      title: 'Celebrate Her Forever with a Gift She\'ll Always Remember',
      image: 'assets/images/banner/wedding.png'  
    },
    {
      badge: 'Engagement',
      title: 'Honor the Beginning of a Beautiful Journey Together',
      image: 'assets/images/banner/engagement.png'
    },
    {
      badge: 'Anniversary',
      title: 'Mark Every Year of Love with a Meaningful Surprise',
      image: 'assets/images/banner/anniversary.png'
    }
  ];
}
