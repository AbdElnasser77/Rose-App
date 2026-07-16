import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { Occasion } from '../../../../models/occasion.model';
import { OccasionsService } from '../../../../services/product-list/occasions.service';
import { ProductFilterService } from '../../../../services/product-list/product-filter.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-occasion-filter',
  imports: [LucideAngularModule,TranslatePipe, SkeletonModule],
  templateUrl: './occasion-filter.component.html',
  styleUrl: './occasion-filter.component.scss',
})
export class OccasionFilterComponent {
    private occasionsService = inject(OccasionsService);
    protected readonly _productFilterService = inject(ProductFilterService);
    private subs = new Subscription();
    
    readonly X = X;
    occasions = signal<Occasion[]>([]);
    occasionsLoading = signal<boolean>(true);

    // Placeholder cells while the lists load.
  readonly skeletons = Array.from({ length: 6 });

    readonly sortedOccasions = computed(() =>
    [...this.occasions()].sort((a, b) => a.title.localeCompare(b.title)),
  );
    
      ngOnInit(): void {
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


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
}
