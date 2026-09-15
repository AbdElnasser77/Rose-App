import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { ToastService } from '@org/shared-util-notification';
import { Subject } from 'rxjs';

import { CategoriesPage } from './categories.page';
import { CategoryModel } from '../../models/category.model';
import { CategoryListResponse } from '../../models/category-response.model';

describe('CategoriesPage', () => {
  let page: CategoriesPage;
  let httpTestingController: HttpTestingController;
  let toastShow: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;

  const mockBaseUrlConfig = { apiUrl: 'https://api.example.test' };
  const url = `${mockBaseUrlConfig.apiUrl}/categories`;

  const category = (id: string, title: string, products = 4): CategoryModel => ({
    id,
    title,
    description: '',
    image: '/uploads/' + id + '.webp',
    immutable: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    subCategories: [],
    _count: { products },
  });

  const envelope = (
    data: CategoryModel[],
    totalPages = 1
  ): CategoryListResponse => ({
    status: true,
    code: 200,
    payload: {
      data,
      metadata: { page: 1, limit: 10, total: data.length, totalPages },
    },
  });

  /** Matches on the path so query params can be asserted separately. */
  const expectListRequest = () =>
    httpTestingController.expectOne((request) => request.url === url);

  beforeEach(() => {
    TestBed.resetTestingModule();

    toastShow = vi.fn();
    navigate = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL_CONFIG, useValue: mockBaseUrlConfig },
        { provide: ToastService, useValue: { show: toastShow } },
        { provide: Router, useValue: { navigate } },
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: TranslateService,
          // `instant` echoes the key back, so assertions can name the key.
          useValue: {
            instant: (key: string) => key,
            onLangChange: new Subject(),
          },
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    // Exercised as a plain class rather than a rendered fixture, keeping the
    // PrimeNG menu and dialog rendering stack out of these tests.
    page = TestBed.runInInjectionContext(() => new CategoriesPage());
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  /** Runs the initial load so each test starts from a populated table. */
  const loadInitial = (data: CategoryModel[], totalPages = 1) => {
    page.ngOnInit();
    expectListRequest().flush(envelope(data, totalPages));
  };

  it('loads the first page of categories', () => {
    loadInitial([category('c1', 'Flowers', 85)]);

    expect(page.categories()).toHaveLength(1);
    expect(page.categories()[0].title).toBe('Flowers');
    expect(page.page()).toBe(1);
  });

  it('exposes a products count column reading the nested _count', () => {
    loadInitial([category('c1', 'Flowers', 85)]);

    const productsColumn = page
      .columns()
      .find((column) => column.key === '_count');

    expect(productsColumn?.getValue?.(category('c1', 'Flowers', 85))).toBe(85);
  });

  it('resets to the first page when a search is typed', () => {
    loadInitial([category('c1', 'Flowers')]);

    page.onPageChange(3);
    expectListRequest().flush(envelope([category('c2', 'Gifts')]));
    expect(page.page()).toBe(3);

    page.onSearch('rose');

    const request = expectListRequest();
    expect(request.request.params.get('search')).toBe('rose');
    // Staying on page 3 would likely show an empty filtered result.
    expect(request.request.params.get('page')).toBe('1');
    expect(page.page()).toBe(1);

    request.flush(envelope([category('c1', 'Flowers')]));
  });

  it('does not delete until the confirmation is accepted', () => {
    loadInitial([category('c1', 'Flowers')]);

    page.askToDelete(category('c1', 'Flowers'));

    // Asking only opens the dialog - no request goes out yet.
    expect(page.categoryToDelete()?.id).toBe('c1');
    httpTestingController.expectNone(`${url}/c1`);
  });

  it('cancelling the confirmation leaves the category alone', () => {
    loadInitial([category('c1', 'Flowers')]);

    page.askToDelete(category('c1', 'Flowers'));
    page.cancelDelete();

    expect(page.categoryToDelete()).toBeNull();
    httpTestingController.expectNone(`${url}/c1`);
  });

  it('deletes, notifies and reloads once confirmed', () => {
    loadInitial([category('c1', 'Flowers'), category('c2', 'Gifts')]);

    page.askToDelete(category('c1', 'Flowers'));
    page.confirmDelete();

    const deleteRequest = httpTestingController.expectOne(`${url}/c1`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush({ status: true, code: 200, message: '', payload: 'c1' });

    expect(toastShow).toHaveBeenCalledWith(
      'DASHBOARD.CATEGORIES.DELETE_SUCCESS',
      'success'
    );
    expect(page.categoryToDelete()).toBeNull();
    expect(page.deleting()).toBe(false);

    expectListRequest().flush(envelope([category('c2', 'Gifts')]));
  });

  it('steps back a page when the last row on it is deleted', () => {
    loadInitial([category('c1', 'Flowers')], 2);

    page.onPageChange(2);
    expectListRequest().flush(envelope([category('c9', 'Last one')], 2));

    page.askToDelete(category('c9', 'Last one'));
    page.confirmDelete();
    httpTestingController
      .expectOne(`${url}/c9`)
      .flush({ status: true, code: 200, message: '', payload: 'c9' });

    // Page 2 is now empty, so the table falls back to page 1.
    expect(page.page()).toBe(1);

    const reload = expectListRequest();
    expect(reload.request.params.get('page')).toBe('1');
    reload.flush(envelope([category('c1', 'Flowers')]));
  });

  it('keeps the confirmation closed and stops spinning when delete fails', () => {
    loadInitial([category('c1', 'Flowers')]);

    page.askToDelete(category('c1', 'Flowers'));
    page.confirmDelete();

    httpTestingController
      .expectOne(`${url}/c1`)
      .flush({ status: false, code: 500, message: 'boom', payload: '' }, {
        status: 500,
        statusText: 'Server Error',
      });

    expect(page.deleting()).toBe(false);
    expect(page.categoryToDelete()).toBeNull();
    expect(toastShow).not.toHaveBeenCalled();
  });
});
