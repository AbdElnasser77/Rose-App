import { Component, input, output, signal } from '@angular/core';
import { TableColumn } from '../models/table-column.model';
import { TableAction } from '../models/table-action.model';
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
  openMobileMenu(event: Event, menu: Menu, row: T): void {
    const items : MenuItem[] = this.actions().map((action) => ({
      label: action.label,
      command: () => action.action(row),
       data: {
      icon: action.icon,
      },
    }));
     this.activeMenuItems.set(items);
     menu.toggle(event);

  }
    // pagination
   page = input<number>(1);
   totalPages = input<number>(1);
   pageChange = output<number>();

  //  search
  search = input<string>('');
  searchChange = output<string>();

  onSearch(event: Event): void {
  const value = (event.target as HTMLInputElement).value;

  this.searchChange.emit(value);
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