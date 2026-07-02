import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RatingModule } from 'primeng/rating';
import {
  Cake,
  Candy,
  Flower,
  Gem,
  Gift,
  LucideAngularModule,
  Mail,
  PartyPopper,
  RotateCcw,
  SprayCan,
  Sprout,
  ToyBrick,
  X,
} from 'lucide-angular';
import { ButtonComponent } from '@org/ui';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';

@Component({
  selector: 'app-products-filter',
  imports: [
    FormsModule,
    RatingModule,
    LucideAngularModule,
    ButtonComponent,
    AssetUrlPipe,
    TranslatePipe,
  ],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss',
})
export class ProductsFilterComponent {
  // Icons
  readonly X = X;
  readonly RotateCcw = RotateCcw;

  // --- UI state (self-contained; not wired to the product query yet) ---
  selectedCategoryId = signal<string | null>(null);
  selectedOccasionId = signal<string | null>(null);
  rating = signal<number>(0);
  priceFrom = signal<number | null>(null);
  priceTo = signal<number | null>(null);

  // --- Mock data (UI only — no categories/occasions endpoint exists yet) ---
  readonly categories = [
    { id: 'balloons', title: 'Balloons', icon: PartyPopper },
    { id: 'cakes', title: 'Cakes', icon: Cake },
    { id: 'cards', title: 'Cards', icon: Mail },
    { id: 'chocolate', title: 'Chocolate', icon: Candy },
    { id: 'flowers', title: 'Flowers', icon: Flower },
    { id: 'gifts', title: 'Gifts', icon: Gift },
    { id: 'jewelry', title: 'Jewelry', icon: Gem },
    { id: 'perfumes', title: 'Perfumes', icon: SprayCan },
    { id: 'plants', title: 'Plants', icon: Sprout },
    { id: 'toys', title: 'Toys', icon: ToyBrick },
  ];

  readonly occasions = [
    { id: 'anniversary', title: 'Anniversary', image: 'assets/images/banner/anniversary.png' },
    { id: 'apology', title: 'Apology', image: 'assets/images/banner/specialGifts.png' },
    { id: 'birthday', title: 'Birthday', image: 'assets/images/banner/engagement.png' },
    { id: 'engagement', title: 'Engagement', image: 'assets/images/banner/engagement.png' },
    { id: 'fathers-day', title: "Father's Day", image: 'assets/images/banner/specialGifts.png' },
    { id: 'graduation', title: 'Graduation', image: 'assets/images/banner/wedding.png' },
    { id: 'valentine', title: "Valentine's", image: 'assets/images/banner/anniversary.png' },
    { id: 'wedding', title: 'Wedding', image: 'assets/images/banner/wedding.png' },
  ];

  // Displayed sorted by name (requirement).
  readonly sortedCategories = computed(() =>
    [...this.categories].sort((a, b) => a.title.localeCompare(b.title)),
  );
  readonly sortedOccasions = computed(() =>
    [...this.occasions].sort((a, b) => a.title.localeCompare(b.title)),
  );

  readonly hasActiveFilters = computed(
    () =>
      this.selectedCategoryId() !== null ||
      this.selectedOccasionId() !== null ||
      this.rating() > 0 ||
      this.priceFrom() !== null ||
      this.priceTo() !== null,
  );

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
}
