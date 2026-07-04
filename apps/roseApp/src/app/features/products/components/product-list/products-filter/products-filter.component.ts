import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { LucideAngularModule, RotateCcw, X } from 'lucide-angular';
import { ButtonComponent } from '@org/ui';
import { Category } from '../../../models/category.model';
import { Occasion } from '../../../models/occasion.model';
import { CategoriesService } from '../../../services/product-list/categories.service';
import { OccasionsService } from '../../../services/product-list/occasions.service';

@Component({
  selector: 'app-products-filter',
  imports: [
    FormsModule,
    RatingModule,
    SkeletonModule,
    LucideAngularModule,
    ButtonComponent,
    TranslatePipe,
  ],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss',
})
export class ProductsFilterComponent implements OnInit, OnDestroy {
  private categoriesService = inject(CategoriesService);
  private occasionsService = inject(OccasionsService);
  private subs = new Subscription();

  // Icons
  readonly X = X;
  readonly RotateCcw = RotateCcw;

  // Placeholder cells while the lists load.
  readonly skeletons = Array.from({ length: 6 });

  // --- Option lists (from the API) ---
  categories = signal<Category[]>([]);
  occasions = signal<Occasion[]>([]);
  categoriesLoading = signal<boolean>(true);
  occasionsLoading = signal<boolean>(true);

  // Displayed sorted by name (requirement).
  readonly sortedCategories = computed(() =>
    [...this.categories()].sort((a, b) => a.title.localeCompare(b.title)),
  );
  readonly sortedOccasions = computed(() =>
    [...this.occasions()].sort((a, b) => a.title.localeCompare(b.title)),
  );

  // --- Selection state (self-contained; not wired to the product query yet) ---
  selectedCategoryId = signal<string | null>(null);
  selectedOccasionId = signal<string | null>(null);
  rating = signal<number>(0);
  priceFrom = signal<number | null>(null);
  priceTo = signal<number | null>(null);

  readonly hasActiveFilters = computed(
    () =>
      this.selectedCategoryId() !== null ||
      this.selectedOccasionId() !== null ||
      this.rating() > 0 ||
      this.priceFrom() !== null ||
      this.priceTo() !== null,
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

    this.subs.add(
      this.occasionsService.getOccasions().subscribe({
        next: (data) => {
          this.occasions.set(data);
          this.occasionsLoading.set(false);
        },
        error: () => {
          this.occasionsLoading.set(false);
        },
      }),
    );
  }

  selectCategory(id: string): void {
    this.selectedCategoryId.set(id);
  }

  resetCategory(): void {
    this.selectedCategoryId.set(null);
  }

  selectOccasion(id: string): void {
    this.selectedOccasionId.update((current) => (current === id ? null : id));
  }

  resetOccasion(): void {
    this.selectedOccasionId.set(null);
  }

  resetRating(): void {
    this.rating.set(0);
  }

  resetPrice(): void {
    this.priceFrom.set(null);
    this.priceTo.set(null);
  }

  resetAll(): void {
    this.resetCategory();
    this.resetOccasion();
    this.resetRating();
    this.resetPrice();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
