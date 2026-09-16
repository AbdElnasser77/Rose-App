import { AfterViewInit, Component, DestroyRef, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductQueryParams } from '../../models/product-query.model';
import { ProductModel } from '../../models/product.model';
import { DynamicTableComponent } from '../../../../shared/ui/dynamic-table/components/dynamic-table.component';
import { TableColumn } from '../../../../shared/ui/dynamic-table/models/table-column.model';
import { TableAction } from '../../../../shared/ui/dynamic-table/models/table-action.model';
import { LucideAngularModule, Pencil ,Trash ,Plus } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@org/ui';
import { DeleteConfirmationModalComponent } from '../../../../shared/ui/delete-confirmation-modal/delete-confirmation-modal.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [DynamicTableComponent ,LucideAngularModule ,TranslatePipe ,ButtonComponent, DeleteConfirmationModalComponent],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
})
export class ProductsPage implements OnInit , AfterViewInit{
  @ViewChild('stockTemplate') stockTemplate!: TemplateRef<unknown>;
  
  private readonly _productsService = inject(ProductsService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  
  
  private readonly _searchSubject = new Subject<string>();

  readonly Plus  = Plus ;
  products = signal<ProductModel[]>([]);
  page = signal(1);
  totalPages = signal(1);
  readonly productToDelete = signal<ProductModel | null>(null);

  queryParams: ProductQueryParams = {
  page: 1,
  limit: 10,
  };
  columns: TableColumn<ProductModel>[] = [
    {key: 'title',header: 'DASHBOARD.PRODUCTS.TABLE.NAME',},
    {key: 'price',header: 'DASHBOARD.PRODUCTS.TABLE.PRICE',},
    {key: 'stock',header: 'DASHBOARD.PRODUCTS.TABLE.STOCK',},
    {key: '_count', header: 'DASHBOARD.PRODUCTS.TABLE.SALES',getValue: (row: ProductModel) => row._count.orderItems},
    {key: 'ratings', header: 'DASHBOARD.PRODUCTS.TABLE.RATINGS',},
    ];

  actions :TableAction<ProductModel>[] = [
  { label: 'DASHBOARD.PRODUCTS.ACTIONS.EDIT',icon :Pencil, action: (product) => this.editProduct(product),},
  { label: 'DASHBOARD.PRODUCTS.ACTIONS.DELETE',icon:Trash, action: (product) => this.deleteProduct(product),},
  ];
   ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
   }

  loadProducts(): void {
  this._productsService.getProducts(this.queryParams).subscribe({
    next: (response) => {
      this.products.set(response.payload.data) ;
       this.totalPages.set(response.payload.metadata.totalPages);
    },
  });
  }

  onPageChange(page: number): void {
  this.page.set(page);
   this.queryParams = {
    ...this.queryParams,
    page,
  };
  this.loadProducts();
  }

  editProduct(product: ProductModel): void {
    this._router.navigate(
    [product.id, 'edit'],
    { relativeTo: this._route }
  );
  }

  deleteProduct(product: ProductModel): void {
    this.productToDelete.set(product);
  }

  confirmDelete(): void {
    const product = this.productToDelete();

    if (!product) {
      return;
    }

    this._productsService.deleteProduct(product.id).subscribe({
    next: () => {
      this._toastService.show(
      this._translateService.instant('DASHBOARD.PRODUCTS.DELETE_SUCCESS'),
      'success'
    );
      this.loadProducts();
      this.productToDelete.set(null);
    },
  });
  }

  closeDeleteModal(): void {
    this.productToDelete.set(null);
  }
  private setupSearch(): void {
  this._searchSubject
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((search) => {
        this.queryParams = {
          ...this.queryParams,
          search,
          page: 1,
        };

        this.page.set(1);

        return this._productsService.getProducts(this.queryParams);
      }),
      takeUntilDestroyed(this._destroyRef)
    )
    .subscribe({
      next: (response) => {
        this.products.set(response.payload.data);
        this.totalPages.set(response.payload.metadata.totalPages);
      },
    });
}
  onSearch(search: string): void {
    this._searchSubject.next(search);
   }

   onAddClicked(){
    this._router.navigate(
    [ 'add'],
    { relativeTo: this._route }
  );
   }
   
   ngAfterViewInit(): void {
  this.columns = this.columns.map((column) =>
    column.key === 'stock'
      ? {
          ...column,
          template: this.stockTemplate,
        }
      : column
  );
  }
}