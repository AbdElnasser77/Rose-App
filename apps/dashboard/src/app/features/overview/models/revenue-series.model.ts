import { RevenuePeriod } from './admin-statistics.model';

export interface RevenuePoint {
  /** Raw bucket key, e.g. `2026-08` (monthly) or `2026-08-25` (week). */
  period: string;
  /** Display label the API already localised to a short month/weekday name. */
  label: string;
  revenue: number;
}

export interface RevenueSeries {
  period: RevenuePeriod;
  points: RevenuePoint[];
}
