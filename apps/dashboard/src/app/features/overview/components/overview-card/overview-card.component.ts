import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * The white panel every overview widget sits in. Keeps radius, padding and the
 * header rhythm identical across the page.
 */
@Component({
  selector: 'app-overview-card',
  imports: [TranslatePipe],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
})
export class OverviewCardComponent {
  /** Omit for a card that renders no header, e.g. the stat-tile grid. */
  readonly titleKey = input<string | null>(null);
  /** Centres the heading, as the Orders Status card does. */
  readonly centerTitle = input(false);
}
