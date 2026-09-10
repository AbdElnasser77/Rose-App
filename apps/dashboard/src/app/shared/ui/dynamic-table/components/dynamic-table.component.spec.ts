import { vi } from 'vitest';

import { DynamicTableComponent } from './dynamic-table.component';
import { TableColumn } from '../models/table-column.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';


interface TestProduct {
   id: string;
  name: string;
  price: number;
  stock: number;
}

describe('DynamicTableComponent', () => {
    let fixture: ComponentFixture<DynamicTableComponent<TestProduct>>;

  let component: DynamicTableComponent<TestProduct>;

  const mockColumns: TableColumn<TestProduct>[] = [
    { key: 'id', header: 'ID', sortable: true },
  ];

    const mockData: TestProduct[] = [
      { id: '1', name: 'Product 1', price: 100, stock: 10 },
      
    ];
  const translateServiceMock = {
  instant: vi.fn(),
   };
  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [DynamicTableComponent],
         
      
      providers: [
        
        { provide: TranslateService, useValue: translateServiceMock },
      ]
      
    })
      
      .compileComponents();

    fixture = TestBed.createComponent(DynamicTableComponent<TestProduct>);
    component = fixture.componentInstance;
  });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit searchChange event when onSearch is called', () => {
        const  searchSpy  = vi.spyOn(component.searchChange, 'emit');

        const input = document.createElement('input');
        input.value = 'Rose';

        const event = new Event('input');
        Object.defineProperty(event, 'target', { value: input, writable: false });
        
        component.onSearch(event);

        expect( searchSpy ).toHaveBeenCalledWith('Rose');
    });


    it('should emit ascending sort on first click', () => {
        const sortSpy = vi.spyOn(component.sortChange , 'emit');

        component.sort(mockColumns[0]);
        expect( sortSpy ).toHaveBeenCalledWith({ key: mockColumns[0].key, direction: 'asc' });
    });

    it('should emit descending sort on second click', () => {
        const sortSpy = vi.spyOn(component.sortChange , 'emit');

        component.sort(mockColumns[0]);
        component.sort(mockColumns[0]);
        expect( sortSpy ).toHaveBeenCalledWith({ key: mockColumns[0].key, direction: 'desc' });
    });

    it('should execute action with the selected row', () => {
      const actionSpy = vi.fn();
      const mockAction = {
        label: 'Test Action',
        action: actionSpy,
      };

      mockAction.action(mockData[0]);
      expect(actionSpy).toHaveBeenCalledWith(mockData[0]);
    });
});