import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BASE_URL_CONFIG } from '@org/auth';

import { OverviewPage } from './overview.page';
import {
  AdminStatistics,
  AdminStatisticsResponse,
} from '../../models/admin-statistics.model';

describe('OverviewPage', () => {
  let page: OverviewPage;
  let httpTestingController: HttpTestingController;

  const mockBaseUrlConfig = { apiUrl: 'https://api.example.test' };
  const url = `${mockBaseUrlConfig.apiUrl}/admin/statistics`;

  /**
   * `revenueLabel` and `categoryTitle` differ per call so a test can tell which
   * response a given panel is showing.
   */
  const statistics = (
    revenueLabel: string,
    categoryTitle = 'Birthday',
  ): AdminStatistics => ({
    summary: {
      totalProducts: 12,
      totalOrders: 8,
      totalCategories: 3,
      totalRevenue: 500,
      currency: 'EGP',
    },
    categories: [{ id: 'c1', title: categoryTitle, productCount: 4 }],
    orderStatus: {
      completed: { count: 5, percent: 62.5 },
      inProgress: { count: 2, percent: 25 },
      canceled: { count: 1, percent: 12.5 },
      totalOrders: 8,
    },
    revenue: {
      period: 'monthly',
      points: [{ period: '2026-08', label: revenueLabel, revenue: 500 }],
    },
    topSellingProducts: [
      { productId: 'p1', title: 'Rose Box', unitPrice: 250, totalSales: 2 },
    ],
    lowStockProducts: [{ id: 'p2', title: 'Tulip Box', stock: 3 }],
  });

  const envelope = (payload: AdminStatistics): AdminStatisticsResponse => ({
    status: true,
    code: 200,
    payload,
  });

  /** Matches on the path so query params can be asserted separately. */
  const expectStatisticsRequest = () =>
    httpTestingController.expectOne((request) => request.url === url);

  beforeEach(() => {
    // runInInjectionContext below instantiates the TestBed, so it has to be
    // torn down before the next test can reconfigure it.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL_CONFIG, useValue: mockBaseUrlConfig },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    // Exercised as a plain class rather than a rendered fixture: this suite is
    // about the loading logic, and constructing it keeps the chart and PrimeNG
    // rendering stack out of the test.
    page = TestBed.runInInjectionContext(() => new OverviewPage());
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  /** Runs the initial load so each test starts from a fully loaded page. */
  const loadInitial = () => {
    page.ngOnInit();
    expectStatisticsRequest().flush(envelope(statistics('Aug')));
  };

  it('fills every panel on the first load', () => {
    loadInitial();

    expect(page.loading()).toBe(false);
    expect(page.summary()?.totalProducts).toBe(12);
    expect(page.categories()).toHaveLength(1);
    expect(page.revenue()?.points[0].label).toBe('Aug');
  });

  it('does not put the whole page back into loading on a range switch', () => {
    loadInitial();

    page.onRevenuePeriodChange('week');

    // The page-wide flag stays down, so the other five cards keep rendering.
    expect(page.loading()).toBe(false);
    expect(page.revenueLoading()).toBe(true);

    expectStatisticsRequest().flush(envelope(statistics('Mon')));
    expect(page.revenueLoading()).toBe(false);
  });

  it('replaces only the revenue slice on a range switch', () => {
    loadInitial();

    page.onRevenuePeriodChange('week');
    expectStatisticsRequest()
      .flush(envelope(statistics('Mon', 'Wedding')));

    expect(page.revenue()?.points[0].label).toBe('Mon');
    // The response also carried a different category, which must be ignored.
    expect(page.categories()[0].title).toBe('Birthday');
  });

  it('ignores a click on the period already selected', () => {
    loadInitial();

    page.onRevenuePeriodChange('monthly');

    httpTestingController.expectNone((request) => request.url === url);
    expect(page.revenueLoading()).toBe(false);
  });

  it('ignores a stale response for a period no longer selected', () => {
    loadInitial();

    page.onRevenuePeriodChange('week');
    const weekRequest = expectStatisticsRequest();

    page.onRevenuePeriodChange('monthly');
    const monthlyRequest = expectStatisticsRequest();

    // The slower 'week' answer arrives after the user already switched back.
    monthlyRequest.flush(envelope(statistics('Sep')));
    weekRequest.flush(envelope(statistics('Mon')));

    expect(page.revenue()?.points[0].label).toBe('Sep');
  });

  it('keeps the chart on screen when a range switch fails', () => {
    loadInitial();

    page.onRevenuePeriodChange('week');
    expectStatisticsRequest()
      .error(new ProgressEvent('network error'));

    // `failed` would blank the entire page; a range switch must not do that.
    expect(page.failed()).toBe(false);
    expect(page.revenueLoading()).toBe(false);
    expect(page.revenue()?.points[0].label).toBe('Aug');
  });
});
