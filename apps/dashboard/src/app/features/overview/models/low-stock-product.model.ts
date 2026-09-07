export interface LowStockProduct {
  id: string;
  title: string;
  stock: number;
}

/** Drives the colour of the stock figure; keeps the thresholds in one place. */
export type StockSeverity = 'critical' | 'warning' | 'muted';

export function stockSeverity(stock: number): StockSeverity {
  if (stock < 5) return 'critical';
  if (stock < 10) return 'warning';
  return 'muted';
}
