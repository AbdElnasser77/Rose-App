import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LowStockProduct,
  StockSeverity,
  stockSeverity,
} from '../../models/low-stock-product.model';
import { OverviewCardComponent } from '../overview-card/overview-card.component';

const SEVERITY_CLASSES: Record<StockSeverity, string> = {
  critical: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  muted: 'text-zinc-500 dark:text-zinc-400',
};

@Component({
  selector: 'app-low-stock-card',
  imports: [TranslatePipe, OverviewCardComponent],
  templateUrl: './low-stock-card.component.html',
  styleUrl: './low-stock-card.component.scss',
})
export class LowStockCardComponent {
  readonly products = input.required<LowStockProduct[]>();
  readonly loading = input(false);

  readonly skeletonRows = Array.from({ length: 8 });

  /**
   * Colour reinforces the stock figure rather than replacing it — the number
   * itself is always the primary channel, so this stays readable without hue.
   */
  stockClass(stock: number): string {
    return SEVERITY_CLASSES[stockSeverity(stock)];
  }
}
