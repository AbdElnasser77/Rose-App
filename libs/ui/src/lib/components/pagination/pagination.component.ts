import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-angular';

@Component({
  selector: 'lib-pagination',
  imports: [CommonModule  ,LucideAngularModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronsRight = ChevronsRight;
  readonly ChevronsLeft = ChevronsLeft;
  page = input<number>(1);
    totalPages = input<number>(1);
  
    pageChange = output<number>();
  
    readonly pages = computed<(number | string)[]>(() =>{
      const total = this.totalPages();

      if(total <=3){
        return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
      }
        return [1, 2, 3, '...', total];
    }
    );

    isPageNumber(value:number | string): value is number{
       return typeof value === 'number';
    }
  
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

    fisrt():void{
       this.goTo(1);
    }

    last():void{
      this.goTo(this.totalPages());
    }
}
