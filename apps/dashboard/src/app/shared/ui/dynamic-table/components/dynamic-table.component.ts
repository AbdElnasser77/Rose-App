import { Component, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TableColumn } from '../models/table-column.model';
import { TableAction, TableActionVariant } from '../models/table-action.model';
import { PaginationComponent } from '@org/ui';
import { ArrowDown, ArrowUp, EllipsisVertical, LucideAngularModule, Search } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { TableSort } from '../models/table-sort.model';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [PaginationComponent, LucideAngularModule ,TranslatePipe
    , NgTemplateOutlet , MenuModule ,CommonModule
  ],
  host: { class: 'flex flex-1 flex-col min-h-0' },
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent<T> {
  readonly  ArrowUp =  ArrowUp;
  readonly  ArrowDown =  ArrowDown;
  readonly Search = Search ;
  readonly EllipsisVertical = EllipsisVertical;

  columns = input<TableColumn<T>[]>([]);
  data = input<T[]>([]);
  actions = input<TableAction<T>[]>([]);

  activeMenuItems = signal<MenuItem[]>([]);

  /**
   * Explicit variant wins; otherwise fall back to sniffing the label so
   * existing callers that pass plain 'Edit' / 'Delete' keep their colours.
   */
  resolveVariant(action: TableAction<T>): TableActionVariant {
    if (action.variant) {
      return action.variant;
    }

    const label = action.label.toLowerCase();

    if (label.includes('edit')) {
      return 'edit';
    }

    if (label.includes('delete')) {
      return 'delete';
    }

    return 'default';
  }

  openMobileMenu(event: Event, menu: Menu, row: T): void {
    const items : MenuItem[] = this.actions().map((action) => ({
      label: action.label,
      command: () => action.action(row),
       data: {
      icon: action.icon,
      variant: this.resolveVariant(action),
      },
    }));
     this.activeMenuItems.set(items);
     menu.toggle(event);

  }
  getCellValue(row:T, column: TableColumn<T>): unknown {
    return column.getValue ? column.getValue(row) : row[column.key];
  } 
    // pagination
   page = input<number>(1);
   totalPages = input<number>(1);
   pageChange = output<number>();

  //  search
  
  searchChange = output<string>();

  /** Milliseconds of quiet before a search is actually issued. */
  static readonly SEARCH_DEBOUNCE_MS = 300;

  private readonly searchTerm = new Subject<string>();

  constructor() {
    // Typing used to fire one request per keystroke. Waiting for a pause, and
    // ignoring repeats, collapses "flowers" from 7 requests down to 1.
    this.searchTerm
      .pipe(
        debounceTime(DynamicTableComponent.SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((value) => this.searchChange.emit(value));
  }

  onSearch(event: Event): void {
  const value = (event.target as HTMLInputElement).value;

  this.searchTerm.next(value);
  }
  // sort
  sortChange = output<TableSort<T>>();
  private sortStates:Partial<Record<keyof T, 'asc' | 'desc'>> = {};

  sort(column: TableColumn<T>): void {
    const currentDirection = this.sortStates[column.key];

    const direction =
    currentDirection === 'asc' ? 'desc' : 'asc';

    this.sortStates[column.key] = direction;
    this.sortChange.emit({key: column.key, direction});
  }

  // Getting sort direction for a column
  getSortDirection(column: TableColumn<T>): 'asc' | 'desc' | null {
    return this.sortStates[column.key] ?? null;
  }

  
}