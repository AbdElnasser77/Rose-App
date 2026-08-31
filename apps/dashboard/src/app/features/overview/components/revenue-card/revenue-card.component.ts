import { Component, computed, inject, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UIChart } from 'primeng/chart';
import { ThemeService } from '@rose/theme';
import { RevenuePeriod } from '../../models/admin-statistics.model';
import { RevenueSeries } from '../../models/revenue-series.model';
import {
  CHART_INK,
  REVENUE_FILL_BOTTOM,
  REVENUE_FILL_TOP,
  REVENUE_LINE_COLOR,
} from '../../overview.palette';
import { OverviewCardComponent } from '../overview-card/overview-card.component';

interface PeriodOption {
  value: RevenuePeriod;
  labelKey: string;
}

@Component({
  selector: 'app-revenue-card',
  imports: [TranslatePipe, UIChart, OverviewCardComponent],
  templateUrl: './revenue-card.component.html',
  styleUrl: './revenue-card.component.scss',
})
export class RevenueCardComponent {
  readonly series = input.required<RevenueSeries | null>();
  readonly activePeriod = input.required<RevenuePeriod>();
  readonly currency = input('');
  readonly loading = input(false);

  readonly periodChange = output<RevenuePeriod>();

  private readonly themeService = inject(ThemeService);

  readonly periodOptions: PeriodOption[] = [
    { value: 'monthly', labelKey: 'DASHBOARD.OVERVIEW.RANGE.MONTHLY' },
    { value: 'week', labelKey: 'DASHBOARD.OVERVIEW.RANGE.LAST_WEEK' },
  ];

  private readonly gridColor = computed(() =>
    this.themeService.isDark() ? CHART_INK.gridlineDark : CHART_INK.gridline,
  );

  private readonly surface = computed(() =>
    this.themeService.isDark() ? CHART_INK.surfaceDark : CHART_INK.surface,
  );

  private readonly points = computed(() => this.series()?.points ?? []);

  /**
   * The API can legitimately return an all-zero series. Labelling a "peak" of
   * zero would be noise, so the direct label is suppressed in that case.
   */
  private readonly peakIndex = computed(() => {
    const points = this.points();
    if (points.length === 0) return -1;
    const peak = points.reduce(
      (best, point, index) =>
        point.revenue > points[best].revenue ? index : best,
      0,
    );
    return points[peak].revenue > 0 ? peak : -1;
  });

  readonly chartData = computed(() => {
    const points = this.points();
    const peak = this.peakIndex();

    return {
      labels: points.map((point) => point.label),
      datasets: [
        {
          data: points.map((point) => point.revenue),
          borderColor: REVENUE_LINE_COLOR,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          // Scriptable so the wash follows the plot height rather than a
          // fixed pixel span.
          backgroundColor: (context: {
            chart: {
              ctx: CanvasRenderingContext2D;
              chartArea?: { top: number; bottom: number };
            };
          }) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return REVENUE_FILL_TOP;
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, REVENUE_FILL_TOP);
            gradient.addColorStop(1, REVENUE_FILL_BOTTOM);
            return gradient;
          },
          pointBackgroundColor: REVENUE_LINE_COLOR,
          // A 2px ring in the surface colour keeps the marker legible where it
          // sits on the line.
          pointBorderColor: this.surface(),
          pointBorderWidth: 2,
          pointRadius: points.map((_, index) => (index === peak ? 5 : 0)),
          pointHoverRadius: 5,
          pointHitRadius: 16,
        },
      ],
    };
  });

  readonly chartOptions = computed(() => {
    const currency = this.currency();

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' as const, intersect: false },
      layout: { padding: { top: 24 } },
      plugins: {
        // One series — the card heading already says what is plotted.
        legend: { display: false },
        tooltip: {
          backgroundColor: this.themeService.isDark() ? '#27272a' : '#18181b',
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context: { raw: unknown }) =>
              `${Number(context.raw).toLocaleString()} ${currency}`.trim(),
          },
        },
      },
      scales: {
        x: {
          grid: { color: this.gridColor(), drawTicks: false },
          border: { display: false },
          ticks: { color: CHART_INK.muted, font: { size: 11 }, padding: 8 },
        },
        y: {
          beginAtZero: true,
          // Direct labels and the tooltip carry the values; horizontal rules
          // would only add ink.
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: CHART_INK.muted,
            font: { size: 11 },
            padding: 8,
            maxTicksLimit: 6,
            // Revenue is whole currency units; without this an all-zero
            // series axis ticks 0.2 / 0.4 / 0.6.
            precision: 0,
          },
        },
      },
    };
  });

  /** Labels the peak and drops a crosshair under the hovered point. */
  readonly peakLabelPlugin = {
    id: 'revenuePeakLabel',
    afterDatasetsDraw: (chart: {
      ctx: CanvasRenderingContext2D;
      chartArea: { top: number; bottom: number };
      tooltip?: { getActiveElements?: () => { element: { x: number } }[] };
      getDatasetMeta: (i: number) => { data: { x: number; y: number }[] };
      data: { datasets: { data: number[] }[] };
    }) => {
      const ctx = chart.ctx;
      const isDark = this.themeService.isDark();

      const active = chart.tooltip?.getActiveElements?.() ?? [];
      if (active.length > 0) {
        ctx.save();
        ctx.strokeStyle = isDark ? CHART_INK.gridlineDark : CHART_INK.gridline;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(active[0].element.x, chart.chartArea.top);
        ctx.lineTo(active[0].element.x, chart.chartArea.bottom);
        ctx.stroke();
        ctx.restore();
      }

      const peak = this.peakIndex();
      if (peak < 0) return;

      const point = chart.getDatasetMeta(0).data[peak];
      const value = chart.data.datasets[0]?.data[peak];
      if (!point || value === undefined) return;

      const text = `${value.toLocaleString()} ${this.currency()}`.trim();

      ctx.save();
      ctx.font = '600 11px system-ui, -apple-system, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = REVENUE_LINE_COLOR;
      ctx.fillText(text, point.x, point.y - 12);
      ctx.restore();
    },
  };

  selectPeriod(period: RevenuePeriod): void {
    if (period !== this.activePeriod()) {
      this.periodChange.emit(period);
    }
  }
}
