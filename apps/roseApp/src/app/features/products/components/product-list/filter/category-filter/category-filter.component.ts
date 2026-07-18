import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CategoriesService } from '../../../../services/product-list/categories.service';
import { Category } from '../../../../models/category.model';
import { ProductFilterService } from '../../../../services/product-list/product-filter.service';
import {  LucideAngularModule, X } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-category-filter',
  imports: [LucideAngularModule,TranslatePipe, SkeletonModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent {
  private categoriesService = inject(CategoriesService);
    protected readonly _productFilterService = inject(ProductFilterService);
    private readonly destroyRef = inject(DestroyRef);
    
    readonly X = X;
    categories = signal<Category[]>([]);
    categoriesLoading = signal<boolean>(true);

    // Placeholder cells while the lists load.
    readonly skeletons = Array.from({ length: 6 });

   

    readonly visibleCategories = computed (() =>{
      const ids = new Set(
        this._productFilterService.allProducts().map(product => product.categoryId)
      );

      return this.categories().filter(category => ids.has(category.id))
      .sort((a,b) => a.title.localeCompare(b.title))

    });
    
  ngOnInit(): void {
    
      this.categoriesService.getCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => {
          this.categories.set(data);
          this.categoriesLoading.set(false);
        },
        error: () => {
          this.categoriesLoading.set(false);
        },
      });
    
  }


 
  
}
