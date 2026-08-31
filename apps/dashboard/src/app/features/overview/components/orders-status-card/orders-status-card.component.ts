import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UIChart } from 'primeng/chart';
import { ThemeService } from '@rose/theme';
import {
  OrderStatusKey,
  OrderStatusSummary,
  ORDER_STATUS_KEYS,
} from '../../models/order-status-summary.model';
import { CHART_INK, ORDER_STATUS_COLORS } from '../../overview.palette';
import { OverviewCardComponent } from '../overview-card/overview-card.component';

interface LegendRow {
  status: OrderStatusKey;
  labelKey: string;
  color: string;
  count: number;
  percent: number;
}

const STATUS_LABEL_KEYS: Record<OrderStatusKey, string> = {
  completed: 'DASHBOARD.OVERVIEW.STATUS.COMPLETED',
  inProgress: 'DASHBOARD.OVERVIEW.STATUS.IN_PROGRESS',
  canceled: 'DASHBOARD.OVERVIEW.STATUS.CANCELED',
};

@Component({
  selector: 'app-orders-status-card',
  imports: [DecimalPipe, TranslatePipe, UIChart, OverviewCardComponent],
  templateUrl: './orders-status-card.component.html',
  styleUrl: './orders-status-card.component.scss',
})
export class OrdersStatusCardComponent {
  readonly summary = input.required<OrderStatusSummary | null>();
  readonly loading = input(false);

  private readonly themeService = inject(ThemeService);
  private readonly translate = inject(TranslateService);

  readonly legendRows = computed<LegendRow[]>(() => {
    const summary = this.summary();
    if (!summary) return [];

    return ORDER_STATUS_KEYS.map((status) => ({
      status,
      labelKey: STATUS_LABEL_KEYS[status],
      color: ORDER_STATUS_COLORS[status],
      count: summary[status]?.count ?? 0,
      percent: summary[status]?.percent ?? 0,
    }));
  });

  /** With every bucket at zero there is no donut to draw, only a legend. */
  readonly hasOrders = computed(() =>
    this.legendRows().some((row) => row.count > 0),
  );

  private readonly surface = computed(() =>
    this.themeService.isDark() ? CHART_INK.surfaceDark : CHART_INK.surface,
  );

  readonly chartData = computed(() => {
    const rows = this.legendRows();
    return {
      labels: rows.map((row) => this.translate.instant(row.labelKey)),
      datasets: [
        {
          data: rows.map((row) => row.count),
          backgroundColor: rows.map((row) => row.color),
          // A 2px gap in the surface colour is what separates the arcs — never
          // a contrasting stroke, which would read as extra data ink.
          borderColor: this.surface(),
          borderWidth: 2,
          hoverBorderColor: this.surface(),
        },
      ],
    };
  });

  readonly chartOptions = computed(() => ({
    cutout: '68%',
    responsive: true,
    maintainAspectRatio: false,
    // No grow-in on load and no arc pop on hover — the donut just draws.
    animation: false as const,
    hover: { mode: 'nearest' as const },
    layout: { padding: 2 },
    plugins: {
      // Identity is carried by the custom legend below the donut instead.
      legend: { display: false },
      tooltip: {
        backgroundColor: this.themeService.isDark() ? '#27272a' : '#18181b',
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: { label: string; raw: unknown }) =>
            ` ${context.label}: ${Number(context.raw).toLocaleString()}`,
        },
      },
    },
  }));

  /**
   * Draws each slice's percentage on its arc. Chart.js has no built-in for
   * this, and a pill in the surface colour keeps the text legible whatever
   * hue sits underneath it.
   */
  readonly percentageLabelPlugin = {
    id: 'arcPercentageLabels',
    afterDatasetsDraw: (chart: {
      ctx: CanvasRenderingContext2D;
      getDatasetMeta: (i: number) => { data: unknown[] };
      data: { datasets: { data: number[] }[] };
    }) => {
      const values = chart.data.datasets[0]?.data ?? [];
      const total = values.reduce((sum, value) => sum + value, 0);
      if (!total) return;

      const ctx = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      const isDark = this.themeService.isDark();

      ctx.save();
      ctx.font = '600 11px system-ui, -apple-system, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      meta.data.forEach((arc, index) => {
        const percent = Math.round((values[index] / total) * 100);
        if (percent < 5) return; // No room on a sliver — the legend has it.

        const { x, y } = (
          arc as { getCenterPoint: () => { x: number; y: number } }
        ).getCenterPoint();
        const text = `${percent}%`;
        const width = ctx.measureText(text).width + 10;
        const height = 16;

        ctx.fillStyle = isDark ? '#27272a' : '#ffffff';
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y - height / 2, width, height, 8);
        ctx.fill();

        ctx.fillStyle = isDark ? '#f4f4f5' : '#18181b';
        ctx.fillText(text, x, y);
      });

      ctx.restore();
    },
  };
}
