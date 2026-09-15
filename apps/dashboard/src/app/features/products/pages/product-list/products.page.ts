import { AfterViewInit, Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [DynamicTableComponent ,LucideAngularModule ,TranslatePipe ,ButtonComponent],
  host: { class: 'flex flex-1 flex-col min-h-0' },
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

  readonly Plus  = Plus ;
  products = signal<ProductModel[]>([]);
  page = signal(1);
  totalPages = signal(1);

  queryParams: ProductQueryParams = {
  page: 1,
  limit: 10,
  };
  columns: TableColumn<ProductModel>[] = [
    {key: 'title',header: 'Name',},
    {key: 'price',header: 'Price',},
    {key: 'stock',header: 'Stock',},
    {key: '_count', header: 'Sales',getValue: (row: ProductModel) => row._count.orderItems},
    {key: 'ratings', header: 'Ratings',},
    ];

  actions :TableAction<ProductModel>[] = [
  { label: 'Edit',icon :Pencil, action: (product) => this.editProduct(product),},
  { label: 'Delete',icon:Trash, action: (product) => this.deleteProduct(product),},
  ];
   ngOnInit(): void {
    this.loadProducts();
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
    this._productsService.deleteProduct(product.id).subscribe({
    next: () => {
      this._toastService.show(
      this._translateService.instant('DASHBOARD.PRODUCTS.DELETE_SUCCESS'),
      'success'
    );
      this.loadProducts();
    },
  });
  }

  onSearch(search: string): void {
  this.queryParams = {
    ...this.queryParams,
    search,
    page: 1,
  };

  this.loadProducts();
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