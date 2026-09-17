import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BASE_URL_CONFIG } from '@org/auth';

import { CategoriesService } from './categories.service';
import {
  CategoryListResponse,
  CategoryMutationResponse,
} from '../models/category-response.model';
import { CategoryModel } from '../models/category.model';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpTestingController: HttpTestingController;

  const mockBaseUrlConfig = { apiUrl: 'https://api.example.test' };
  const url = `${mockBaseUrlConfig.apiUrl}/categories`;

  const mockListResponse: CategoryListResponse = {
    status: true,
    code: 200,
    payload: {
      data: [
        {
          id: 'c1',
          title: 'Flowers',
          description: 'Fresh flowers',
          image: '/uploads/flowers.webp',
          immutable: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          subCategories: [],
          _count: { products: 85 },
        },
      ],
      metadata: { page: 1, limit: 10, total: 1, totalPages: 1 },
    },
  };

  const mockMutationResponse: CategoryMutationResponse = {
    status: true,
    code: 200,
    message: 'ok',
    payload: 'c1',
  };

  /** Matches on path only, so query params can be asserted separately. */
  const expectListRequest = () =>
    httpTestingController.expectOne((request) => request.url === url);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL_CONFIG, useValue: mockBaseUrlConfig },
      ],
    });

    service = TestBed.inject(CategoriesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends paging and search as query params', () => {
    service.getCategories({ page: 2, limit: 10, search: 'rose' }).subscribe();

    const request = expectListRequest();
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('limit')).toBe('10');
    expect(request.request.params.get('search')).toBe('rose');

    request.flush(mockListResponse);
  });

  it('drops empty and undefined params so API defaults still apply', () => {
    service.getCategories({ page: 1, search: '', limit: undefined }).subscribe();

    const request = expectListRequest();
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.has('search')).toBe(false);
    expect(request.request.params.has('limit')).toBe(false);

    request.flush(mockListResponse);
  });

  it('posts the uploaded image path rather than the file itself', () => {
    const imagePath = '/api/upload/temp/550e8400-e29b-41d4-a716-446655440000';

    service.createCategory({ title: 'Flowers', image: imagePath }).subscribe();

    const request = httpTestingController.expectOne(url);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      title: 'Flowers',
      image: imagePath,
    });

    request.flush(mockMutationResponse);
  });

  it('patches only the fields it is given, leaving the rest untouched', () => {
    service.updateCategory('c1', { title: 'Gift Flowers' }).subscribe();

    const request = httpTestingController.expectOne(`${url}/c1`);
    expect(request.request.method).toBe('PATCH');

    // No `image` key: the category keeps the image it already has.
    expect(request.request.body).toEqual({ title: 'Gift Flowers' });

    request.flush(mockMutationResponse);
  });

  it('reads a single category from the nested payload', () => {
    let received: CategoryModel | undefined;

    service
      .getCategory('c1')
      .subscribe((response) => (received = response.payload.category));

    const request = httpTestingController.expectOne(`${url}/c1`);
    expect(request.request.method).toBe('GET');

    // The single read wraps the record in `payload.category`, unlike the list.
    request.flush({
      status: true,
      code: 200,
      payload: { category: mockListResponse.payload.data[0] },
    });

    expect(received?.title).toBe('Flowers');
  });

  it('deletes by id', () => {
    service.deleteCategory('c1').subscribe();

    const request = httpTestingController.expectOne(`${url}/c1`);
    expect(request.request.method).toBe('DELETE');

    request.flush(mockMutationResponse);
  });
});
