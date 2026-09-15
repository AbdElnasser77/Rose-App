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

   

    // Every category the store has, newly created and empty ones included.
    // This used to match against `allProducts()`, but that only ever holds one
    // page of 20 products, so categories whose products sat on a later page
    // disappeared and the list shifted as the user paginated.
    readonly visibleCategories = computed (() =>
      this.categories()
      .slice()
      .sort((a,b) => a.title.localeCompare(b.title))
    );
    
  ngOnInit(): void {
    
      this.categoriesService.getAllCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
