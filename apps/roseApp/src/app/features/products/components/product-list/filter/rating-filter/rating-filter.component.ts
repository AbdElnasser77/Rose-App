import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductFilterService } from '../../../../services/product-list/product-filter.service';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-rating-filter',
  imports: [LucideAngularModule,TranslatePipe, SkeletonModule,RatingModule,FormsModule],
  templateUrl: './rating-filter.component.html',
  styleUrl: './rating-filter.component.scss',
})
export class RatingFilterComponent {
  protected readonly _productFilterService = inject(ProductFilterService);
  readonly X = X;
      

  
}
