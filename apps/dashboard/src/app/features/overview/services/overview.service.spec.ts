import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BASE_URL_CONFIG } from '@org/auth';

import { OverviewService } from './overview.service';
import {
  AdminStatistics,
  AdminStatisticsResponse,
} from '../models/admin-statistics.model';

describe('OverviewService', () => {
  let service: OverviewService;
  let httpTestingController: HttpTestingController;

  const mockBaseUrlConfig = { apiUrl: 'https://api.example.test' };
  const url = `${mockBaseUrlConfig.apiUrl}/admin/statistics`;

  const mockResponse: AdminStatisticsResponse = {
    status: true,
    code: 200,
    payload: {
      summary: {
        totalProducts: 12,
        totalOrders: 8,
        totalCategories: 3,
        totalRevenue: 500,
        currency: 'EGP',
      },
      categories: [{ id: 'c1', title: 'Birthday', productCount: 4 }],
      orderStatus: {
        completed: { count: 5, percent: 62.5 },
        inProgress: { count: 2, percent: 25 },
        canceled: { count: 1, percent: 12.5 },
        totalOrders: 8,
      },
      revenue: {
        period: 'monthly',
        points: [{ period: '2026-08', label: 'Aug', revenue: 500 }],
      },
      topSellingProducts: [
        { productId: 'p1', title: 'Rose Box', unitPrice: 250, totalSales: 2 },
      ],
      lowStockProducts: [{ id: 'p2', title: 'Tulip Box', stock: 3 }],
    },
  };

  /** Matches on the path so query params can be asserted separately. */
  const expectStatisticsRequest = () =>
    httpTestingController.expectOne((request) => request.url === url);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OverviewService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL_CONFIG, useValue: mockBaseUrlConfig },
      ],
    });

    service = TestBed.inject(OverviewService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('unwraps the payload out of the API envelope', () => {
    let received: AdminStatistics | undefined;

    service.getStatistics().subscribe((statistics) => (received = statistics));

    const request = expectStatisticsRequest();
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);

    // Callers get the payload itself, never the { status, code, payload } wrapper.
    expect(received).toEqual(mockResponse.payload);
  });

  it('sends only the query params it was given', () => {
    service
      .getStatistics({ revenuePeriod: 'week', topProductsLimit: 10 })
      .subscribe();

    const request = expectStatisticsRequest();
    expect(request.request.params.get('revenuePeriod')).toBe('week');
    expect(request.request.params.get('topProductsLimit')).toBe('10');

    // Omitted on purpose, so the API's own defaults still apply.
    expect(request.request.params.has('lowStockThreshold')).toBe(false);
    expect(request.request.params.has('lowStockLimit')).toBe(false);

    request.flush(mockResponse);
  });

  it('drops params explicitly set to undefined', () => {
    service
      .getStatistics({ revenuePeriod: 'monthly', topProductsLimit: undefined })
      .subscribe();

    const request = expectStatisticsRequest();
    expect(request.request.params.get('revenuePeriod')).toBe('monthly');
    expect(request.request.params.has('topProductsLimit')).toBe(false);

    request.flush(mockResponse);
  });
});
