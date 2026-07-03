import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  private readonly imagePath = '/assets/about-us';

  images = {
    main: `${this.imagePath}/about-main.png`,
    giftBox: `${this.imagePath}/about-gift-box.png`,
    balloons: `${this.imagePath}/about-balloons.png`,
  };

  features = [
    'ABOUT_US.FEATURES.PRICES',
    'ABOUT_US.FEATURES.PREMIUM',
    'ABOUT_US.FEATURES.OCCASION',
    'ABOUT_US.FEATURES.DELIVERY',
  ];
}