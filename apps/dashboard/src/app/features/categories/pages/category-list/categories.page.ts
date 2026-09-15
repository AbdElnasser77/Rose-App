import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@org/shared-util-notification';
import { ButtonComponent } from '@org/ui';
import { LucideAngularModule, Pencil, Plus, Trash } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/components/confirm-dialog.component';
import { DynamicTableComponent } from '../../../../shared/ui/dynamic-table/components/dynamic-table.component';
import { TableAction } from '../../../../shared/ui/dynamic-table/models/table-action.model';
import { TableColumn } from '../../../../shared/ui/dynamic-table/models/table-column.model';
import { CategoryQueryParams } from '../../models/category-query.model';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    DynamicTableComponent,
    ConfirmDialogComponent,
    LucideAngularModule,
    TranslatePipe,
    ButtonComponent,
  ],
  host: { class: 'flex flex-1 flex-col min-h-0' },
  templateUrl: './categories.page.html',
})
export class CategoriesPage implements OnInit, AfterViewInit {
  @ViewChild('productsTemplate') productsTemplate!: TemplateRef<unknown>;

  private readonly _categoriesService = inject(CategoriesService);
  private readonly _toastService = inject(ToastService);
  private readonly _translateService = inject(TranslateService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  readonly Plus = Plus;

  readonly categories = signal<CategoryModel[]>([]);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly deleting = signal(false);
  readonly categoryToDelete = signal<CategoryModel | null>(null);

  readonly columns = signal<TableColumn<CategoryModel>[]>([]);
  readonly actions = signal<TableAction<CategoryModel>[]>([]);

  private queryParams: CategoryQueryParams = {
    page: 1,
    limit: 10,
  };

  ngOnInit(): void {
    this.buildTableConfig();

    // Headers and action labels are translated eagerly, so they have to be
    // rebuilt whenever the user switches language.
    this._translateService.onLangChange
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.buildTableConfig());

    this.loadCategories(false);
  }

  ngAfterViewInit(): void {
    this.attachProductsTemplate();
  }

  private buildTableConfig(): void {
    this.columns.set([
      {
        key: 'title',
        header: this._translateService.instant('DASHBOARD.CATEGORIES.NAME'),
      },
      {
        key: '_count',
        header: this._translateService.instant('DASHBOARD.CATEGORIES.PRODUCTS'),
        getValue: (row: CategoryModel) => row._count?.products ?? 0,
      },
    ]);

    this.actions.set([
      {
        label: this._translateService.instant('DASHBOARD.COMMON.EDIT'),
        icon: Pencil,
        variant: 'edit',
        action: (category) => this.editCategory(category),
      },
      {
        label: this._translateService.instant('DASHBOARD.COMMON.DELETE'),
        icon: Trash,
        variant: 'delete',
        action: (category) => this.askToDelete(category),
      },
    ]);

    this.attachProductsTemplate();
  }

  private attachProductsTemplate(): void {
    if (!this.productsTemplate) {
      return;
    }

    this.columns.update((columns) =>
      columns.map((column) =>
        column.key === '_count'
          ? { ...column, template: this.productsTemplate }
          : column
      )
    );
  }

  /** The first paint earns the overlay; search and paging refetches do not. */
  loadCategories(skipLoader = true): void {
    this._categoriesService
      .getCategories(this.queryParams, skipLoader)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.categories.set(response.payload.data);
          this.totalPages.set(response.payload.metadata.totalPages);
        },
      });
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.queryParams = { ...this.queryParams, page };
    this.loadCategories();
  }

  onSearch(search: string): void {
    this.queryParams = { ...this.queryParams, search, page: 1 };
    this.page.set(1);
    this.loadCategories();
  }

  onAddClicked(): void {
    this._router.navigate(['add'], { relativeTo: this._route });
  }

  editCategory(category: CategoryModel): void {
    this._router.navigate([category.id, 'edit'], { relativeTo: this._route });
  }

  askToDelete(category: CategoryModel): void {
    this.categoryToDelete.set(category);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }

    this.categoryToDelete.set(null);
  }

  confirmDelete(): void {
    const category = this.categoryToDelete();

    if (!category) {
      return;
    }

    this.deleting.set(true);

    this._categoriesService
      .deleteCategory(category.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.categoryToDelete.set(null);
          this._toastService.show(
            this._translateService.instant(
              'DASHBOARD.CATEGORIES.DELETE_SUCCESS'
            ),
            'success'
          );
          this.reloadAfterDelete();
        },
        error: () => {
          this.deleting.set(false);
          this.categoryToDelete.set(null);
        },
      });
  }

  /** Removing the last row on a page would otherwise leave it empty. */
  private reloadAfterDelete(): void {
    const wasLastRowOnPage = this.categories().length === 1;
    const page = wasLastRowOnPage ? Math.max(1, this.page() - 1) : this.page();

    this.page.set(page);
    this.queryParams = { ...this.queryParams, page };
    this.loadCategories();
  }
}
