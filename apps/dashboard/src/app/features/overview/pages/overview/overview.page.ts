import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ClipboardList,
  CircleDollarSign,
  FileText,
  Package,
} from 'lucide-angular';
import { OverviewService } from '../../services/overview.service';
import {
  AdminStatistics,
  RevenuePeriod,
} from '../../models/admin-statistics.model';
import { StatTileComponent } from '../../components/stat-tile/stat-tile.component';
import { OverviewCardComponent } from '../../components/overview-card/overview-card.component';
import { CategoriesCardComponent } from '../../components/categories-card/categories-card.component';
import { OrdersStatusCardComponent } from '../../components/orders-status-card/orders-status-card.component';
import { RevenueCardComponent } from '../../components/revenue-card/revenue-card.component';
import { TopSellingCardComponent } from '../../components/top-selling-card/top-selling-card.component';
import { LowStockCardComponent } from '../../components/low-stock-card/low-stock-card.component';

@Component({
  selector: 'app-overview-page',
  imports: [
    TranslatePipe,
    StatTileComponent,
    OverviewCardComponent,
    CategoriesCardComponent,
    OrdersStatusCardComponent,
    RevenueCardComponent,
    TopSellingCardComponent,
    LowStockCardComponent,
  ],
  templateUrl: './overview.page.html',
  styleUrl: './overview.page.scss',
})
export class OverviewPage implements OnInit {
  private readonly overviewService = inject(OverviewService);
  private readonly destroyRef = inject(DestroyRef);

  readonly Package = Package;
  readonly FileText = FileText;
  readonly ClipboardList = ClipboardList;
  readonly CircleDollarSign = CircleDollarSign;

  /** The design shows more than the API's default 5 top sellers. */
  private readonly topProductsLimit = 10;

  readonly statistics = signal<AdminStatistics | null>(null);
  readonly loading = signal(true);
  /** Scoped to the revenue card so a range switch never blanks the page. */
  readonly revenueLoading = signal(false);
  readonly failed = signal(false);
  readonly revenuePeriod = signal<RevenuePeriod>('monthly');

  readonly summary = computed(() => this.statistics()?.summary ?? null);
  readonly categories = computed(() => this.statistics()?.categories ?? []);
  readonly orderStatus = computed(() => this.statistics()?.orderStatus ?? null);
  readonly revenue = computed(() => this.statistics()?.revenue ?? null);
  readonly topSelling = computed(
    () => this.statistics()?.topSellingProducts ?? [],
  );
  readonly lowStock = computed(() => this.statistics()?.lowStockProducts ?? []);
  readonly currency = computed(() => this.summary()?.currency ?? '');

  ngOnInit(): void {
    this.load();
  }

  onRevenuePeriodChange(period: RevenuePeriod): void {
    if (period === this.revenuePeriod()) return;
    this.revenuePeriod.set(period);
    this.loadRevenue(period);
  }

  retry(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.failed.set(false);

    this.overviewService
      .getStatistics({
        revenuePeriod: this.revenuePeriod(),
        topProductsLimit: this.topProductsLimit,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (statistics) => {
          this.statistics.set(statistics);
          this.loading.set(false);
        },
        error: () => {
          this.failed.set(true);
          this.loading.set(false);
        },
      });
  }

  private loadRevenue(period: RevenuePeriod): void {
    this.revenueLoading.set(true);

    this.overviewService
      .getStatistics({
        revenuePeriod: period,
        topProductsLimit: this.topProductsLimit,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (statistics) => {
          // A slow earlier response must not clobber a newer selection.
          if (this.revenuePeriod() !== period) return;
          this.statistics.update((current) =>
            current ? { ...current, revenue: statistics.revenue } : statistics,
          );
          this.revenueLoading.set(false);
        },
        error: () => {
          if (this.revenuePeriod() !== period) return;
          // Keep the chart already on screen rather than blanking the page the
          // way the initial loads `failed` flag would.
          this.revenueLoading.set(false);
        },
      });
  }
}
