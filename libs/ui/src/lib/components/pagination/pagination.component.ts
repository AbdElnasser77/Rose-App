import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, ChevronsRight, ChevronLeft } from 'lucide-angular';

@Component({
  selector: 'lib-pagination',
  imports: [CommonModule ,TranslatePipe ,LucideAngularModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly ChevronsRight = ChevronsRight;
  readonly ChevronLeft = ChevronLeft;
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
