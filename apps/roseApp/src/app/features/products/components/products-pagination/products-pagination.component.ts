import { NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-products-pagination',
  imports: [NgClass],
  templateUrl: './products-pagination.component.html',
  styleUrl: './products-pagination.component.scss',
})
export class ProductsPaginationComponent {
  page = input<number>(1);
  totalPages = input<number>(1);

  pageChange = output<number>();

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) {
      return;
    }
    this.pageChange.emit(page);
  }

  prev(): void {
    this.goTo(this.page() - 1);
  }

  next(): void {
    this.goTo(this.page() + 1);
  }
}
