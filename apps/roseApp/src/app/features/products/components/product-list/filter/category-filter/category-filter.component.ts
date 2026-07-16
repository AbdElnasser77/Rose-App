import { Component, computed, inject, signal } from '@angular/core';
import { CategoriesService } from '../../../../services/product-list/categories.service';
import { Category } from '../../../../models/category.model';
import { ProductFilterService } from '../../../../services/product-list/product-filter.service';
import {  LucideAngularModule, X } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';


@Component({
  selector: 'app-category-filter',
  imports: [LucideAngularModule,TranslatePipe, SkeletonModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent {
  private categoriesService = inject(CategoriesService);
    protected readonly _productFilterService = inject(ProductFilterService);
    private subs = new Subscription();
    
    readonly X = X;
    categories = signal<Category[]>([]);
    categoriesLoading = signal<boolean>(true);

    // Placeholder cells while the lists load.
  readonly skeletons = Array.from({ length: 6 });

    readonly sortedCategories = computed(() =>
      [...this.categories()].sort((a, b) => a.title.localeCompare(b.title)),
    );
    
      ngOnInit(): void {
    this.subs.add(
      this.categoriesService.getCategories().subscribe({
        next: (data) => {
          this.categories.set(data);
          this.categoriesLoading.set(false);
        },
        error: () => {
          this.categoriesLoading.set(false);
        },
      }),
    );
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
}
