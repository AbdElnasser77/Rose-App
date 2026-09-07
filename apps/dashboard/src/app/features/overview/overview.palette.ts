import { OrderStatusKey } from './models/order-status-summary.model';

/**
 * Chart colours live here rather than inside the chart components so the donut
 * legend and the donut arcs can never drift apart.
 *
 * The order-status trio was validated against a white card surface: worst
 * adjacent CVD ΔE 23.8, worst normal-vision ΔE 31.3, all three clear 3:1
 * contrast. Re-validate before changing any of them.
 */
export const ORDER_STATUS_COLORS: Record<OrderStatusKey, string> = {
  completed: '#0ca30c',
  inProgress: '#2a78d6',
  canceled: '#d03b3b',
};

/** Single-series revenue line — brand maroon, so no categorical check applies. */
export const REVENUE_LINE_COLOR = '#cd2e33';
export const REVENUE_FILL_TOP = 'rgba(205, 46, 51, 0.18)';
export const REVENUE_FILL_BOTTOM = 'rgba(205, 46, 51, 0.01)';

/** Chart chrome, kept recessive per the mark specs. */
export const CHART_INK = {
  muted: '#898781',
  gridline: '#e1e0d9',
  gridlineDark: '#2c2c2a',
  surface: '#ffffff',
  surfaceDark: '#18181b',
};
