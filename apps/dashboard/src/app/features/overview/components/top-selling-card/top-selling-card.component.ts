import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TopSellingProduct } from '../../models/top-selling-product.model';
import { OverviewCardComponent } from '../overview-card/overview-card.component';

@Component({
  selector: 'app-top-selling-card',
  imports: [DecimalPipe, TranslatePipe, OverviewCardComponent],
  templateUrl: './top-selling-card.component.html',
  styleUrl: './top-selling-card.component.scss',
})
export class TopSellingCardComponent {
  readonly products = input.required<TopSellingProduct[]>();
  /** Comes from the summary block — the product rows carry no currency. */
  readonly currency = input('');
  readonly loading = input(false);

  readonly skeletonRows = Array.from({ length: 6 });

  /** The best seller is tinted; the rest just zebra-stripe for scanability. */
  rowClass(index: number): string {
    if (index === 0) {
      return 'bg-amber-50 dark:bg-amber-950/30';
    }
    return index % 2 === 1
      ? 'bg-zinc-50 dark:bg-zinc-800/40'
      : 'bg-transparent';
  }
}
