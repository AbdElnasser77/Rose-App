import { CategorySummary } from './category-summary.model';
import { LowStockProduct } from './low-stock-product.model';
import { OrderStatusSummary } from './order-status-summary.model';
import { RevenueSeries } from './revenue-series.model';
import { StatisticsSummary } from './statistics-summary.model';
import { TopSellingProduct } from './top-selling-product.model';

/** Revenue chart granularity accepted by `GET /admin/statistics`. */
export type RevenuePeriod = 'monthly' | 'week';

export interface AdminStatistics {
  summary: StatisticsSummary;
  categories: CategorySummary[];
  orderStatus: OrderStatusSummary;
  revenue: RevenueSeries;
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: LowStockProduct[];
}

export interface AdminStatisticsResponse {
  status: boolean;
  code: number;
  payload: AdminStatistics;
}

export interface AdminStatisticsQuery {
  /** Defaults to `monthly` (last 12 months); `week` gives the last 7 days. */
  revenuePeriod?: RevenuePeriod;
  /** Max stock (inclusive) to include in the low-stock list. API default 20. */
  lowStockThreshold?: number;
  /** API default 5, max 50. */
  topProductsLimit?: number;
  /** API default 20, max 100. */
  lowStockLimit?: number;
}
