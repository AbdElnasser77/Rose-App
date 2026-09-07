export type OrderStatusKey = 'completed' | 'inProgress' | 'canceled';

export interface OrderStatusBucket {
  count: number;
  /** Supplied by the API, so the donut and the legend never disagree. */
  percent: number;
}

export type OrderStatusSummary = Record<OrderStatusKey, OrderStatusBucket> & {
  totalOrders: number;
};

/** Fixed render order for the donut arcs and the legend rows. */
export const ORDER_STATUS_KEYS: OrderStatusKey[] = [
  'completed',
  'inProgress',
  'canceled',
];
